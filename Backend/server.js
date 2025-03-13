require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
app.use(express.json())
// Update CORS to allow requests from any origin during development
app.use(
  cors({
    origin: "*", // Allow all origins in development
    methods: ["GET", "POST"],
    credentials: true,
  }),
)

if (!process.env.MONGO_URI) {
  console.error("Missing MONGO_URI in .env file")
  process.exit(1)
}

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err))

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins in development
    methods: ["GET", "POST"],
  },
})

// User Schema & Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userId: String,
  socketId: String,
})

const User = mongoose.model("User", UserSchema)

// Message Schema & Model
const MessageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
})
const Message = mongoose.model("Message", MessageSchema)

// Contact Schema & Model
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  avatar: String,
  status: { type: String, enum: ["online", "offline", "away"], default: "offline" },
})
const Contact = mongoose.model("Contact", ContactSchema)

// Track online users with a Map
const onlineUsers = new Map() // Add this line to define onlineUsers

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ message: "Email already in use" })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ name, email, password: hashedPassword })
    await newUser.save()

    res.status(201).json({ message: "Signup successful" })
  } catch (error) {
    res.status(500).json({ message: "Error signing up", error })
  }
})

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "User not found" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" })

    res.json({ message: "Login successful", user })
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error })
  }
})

// Get All Users (excluding passwords)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error })
  }
})

// Get Contacts - Fixed to handle errors properly
app.get("/api/contacts", async (req, res) => {
  try {
    const users = await User.find({}, { _id: 1, name: 1, email: 1 })

    // If no users found, return empty array instead of error
    if (!users || users.length === 0) {
      return res.json([])
    }

    const contacts = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`,
      status: onlineUsers.has(user._id.toString()) ? "online" : "offline",
    }))

    res.json(contacts)
  } catch (error) {
    console.error("Error in /api/contacts:", error)
    // Return empty array instead of error object to avoid client-side parsing issues
    res.json([])
  }
})

// Get Messages for a Specific Chat
app.get("/api/messages/:userId/:contactId", async (req, res) => {
  try {
    const { userId, contactId } = req.params
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 })

    res.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    res.json([]) // Return empty array on error
  }
})

// Send Message
app.post("/api/messages", async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body
    const newMessage = new Message({ senderId, receiverId, content })
    const savedMessage = await newMessage.save()

    // Send the message to the receiver if online
    const receiverSocketId = onlineUsers.get(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("message", savedMessage)
    }

    res.json(savedMessage)
  } catch (error) {
    console.error("Error sending message:", error)
    res.status(500).json({ message: "Error sending message" })
  }
})

// WebSocket Logic for Real-Time Chat
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id)

  // Register user when they connect
  socket.on("register", (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id)
      console.log(`User registered: ${userId} -> ${socket.id}`)
    }
  })

  socket.on("sendMessage", async (messageData) => {
    try {
      const { senderId, receiverId, content, timestamp } = messageData
      console.log(`Message from ${senderId} to ${receiverId}: ${content}`)

      // Create and save the message
      const newMessage = new Message({
        senderId,
        receiverId,
        content,
        timestamp: timestamp || new Date().toISOString(),
      })
      const savedMessage = await newMessage.save()

      // Emit to the receiver if they're online
      const receiverSocketId = onlineUsers.get(receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("message", savedMessage)
      }

      // Also emit back to the sender for confirmation
      socket.emit("messageSent", savedMessage)
    } catch (error) {
      console.error("Error in sendMessage event:", error)
      socket.emit("messageError", { error: "Failed to send message" })
    }
  })

  socket.on("disconnect", () => {
    // Find and remove the user from onlineUsers
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId)
        console.log(`User disconnected: ${userId}`)
        break
      }
    }
  })
})

// Add a simple health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

