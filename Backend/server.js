require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust to match your frontend
    methods: ["GET", "POST"],
  },
});

// User Schema & Model
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", UserSchema);

// Contact Schema & Model
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  avatar: String,
  status: { type: String, enum: ["online", "offline", "away"], default: "offline" },
});
const Contact = mongoose.model("Contact", ContactSchema);

// Message Schema & Model
const MessageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});
const Message = mongoose.model("Message", MessageSchema);

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ message: "Error signing up", error });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Get All Users (without passwords)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});



// Get Contacts
// Get all registered users as contacts
app.get("/api/contacts", async (req, res) => {
  try {
    const users = await User.find({}, { _id: 1, name: 1, email: 1 }); // Fetch user ID, name, and email
    const contacts = users.map((user) => ({
      id: user._id,
      name: user.name,
      avatar: `https://ui-avatars.com/api/?name=${user.name}`, // Generate avatar dynamically
      status: "offline", // Default status
    }));
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts", error });
  }
});


// Get Messages for a Specific Chat
app.get("/api/messages/:userId/:contactId", async (req, res) => {
  try {
    const { userId, contactId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
});


// Send Message
app.post("/api/messages", async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    const newMessage = new Message({ senderId, receiverId, content });
    const savedMessage = await newMessage.save();

    io.to(onlineUsers.get(receiverId)).emit("receiveMessage", savedMessage);
    res.json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
});


// WebSocket Logic for Real-Time Chat
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("userOnline", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
  });

  socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
    try {
      const newMessage = new Message({ senderId, receiverId, content });
      const savedMessage = await newMessage.save();

      io.to(onlineUsers.get(receiverId)).emit("receiveMessage", savedMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
      }
    });
    io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));