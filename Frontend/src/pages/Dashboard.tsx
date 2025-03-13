"use client"
import { useState, useRef, useEffect } from "react"
import io from "socket.io-client"
import {
  MessageSquare,
  LogOut,
  Search,
  Send,
  Smile,
  Paperclip,
  Image,
  Mic,
  Video,
  Phone,
  MoreVertical,
} from "lucide-react"
import { Navigate, useNavigate } from "react-router-dom"

export default function ChatDashboard() {
  // Add a loading state at the top with other state variables
  const [loading, setLoading] = useState({
    contacts: true,
    messages: false,
  })
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [socket, setSocket] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const SOCKET_URL = "http://localhost:5000"

  type Contact = {
    id: string
    name: string
    avatar: string
    status: "online" | "offline" | "away"
  }

  type Message = {
    id: string
    content: string
    senderId: string
    receiverId: string
    timestamp: string
  }

  const [contacts, setContacts] = useState<Contact[]>([])

  // Replace the contacts fetch useEffect with this improved version
  useEffect(() => {
    setLoading((prev) => ({ ...prev, contacts: true }))

    const fetchContacts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/contacts")

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }

        const data = await res.json()

        if (Array.isArray(data)) {
          setContacts(data)
        } else if (data.error || data.message) {
          console.error("Error from server:", data.message || "Unknown error")
          setContacts([])
        } else {
          console.error("Expected an array of contacts, but got:", data)
          setContacts([])
        }
      } catch (err) {
        console.error("Error fetching contacts:", err)
        setContacts([])
        // You might want to show a toast or notification here
      } finally {
        setLoading((prev) => ({ ...prev, contacts: false }))
      }
    }

    fetchContacts()
  }, [])

  // Update the messages fetch useEffect to use async/await and handle errors better
  useEffect(() => {
    if (!selectedContact) return

    const currentUserId = localStorage.getItem("userId")
    if (!currentUserId) {
      console.error("User ID not found in localStorage")
      return
    }

    setLoading((prev) => ({ ...prev, messages: true }))

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/${currentUserId}/${selectedContact.id}`)

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }

        const data = await res.json()
        setMessages(data)
      } catch (err) {
        console.error("Error fetching messages:", err)
        setMessages([])
      } finally {
        setLoading((prev) => ({ ...prev, messages: false }))
      }
    }

    fetchMessages()
  }, [selectedContact])

  useEffect(() => {
    if (!socket) {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on("connect", () => console.log("✅ Connected to WebSocket"));

        // ✅ Listen for incoming messages
        newSocket.on("message", (newMessage) => {
            console.log("📩 New message received:", newMessage);

            setMessages((prev) => {
                // ✅ Prevent duplicate messages using ID or timestamp check
                if (!prev.some(msg => msg.timestamp === newMessage.timestamp && msg.content === newMessage.content)) {
                    return [...prev, newMessage];
                }
                return prev;
            });
        });

        return () => {
            newSocket.disconnect();
            console.log("❌ WebSocket Disconnected");
        };
    }
}, []);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    let currentUserId = localStorage.getItem("userId");

    if (!currentUserId || currentUserId === "undefined" || currentUserId === "null") {
        console.error("Error: senderId is missing or invalid in localStorage!");
        return;
    }

    console.log("📩 Current user ID:", currentUserId);

    if (message.trim() && socket && selectedContact) {
        const newMessage = {
            senderId: currentUserId.trim(),
            receiverId: selectedContact.id,
            content: message,
            timestamp: new Date().toISOString(),
        };

        console.log("📤 Sending message:", newMessage);

        fetch("http://localhost:5000/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMessage),
        })
            .then((res) => res.json())
            .then((savedMessage) => {
                console.log("✅ Saved message from API:", savedMessage);

                if (!savedMessage.senderId || savedMessage.senderId === "undefined") {
                    console.error("Error: senderId is missing in API response!");
                    return;
                }

                // ✅ Emit the message via WebSocket
                socket.emit("sendMessage", savedMessage);

                // ❌ DO NOT manually add it to `setMessages`
                setMessage(""); // Clear input field
            })
            .catch((err) => console.error("❌ Error sending message:", err));
    }
};



const userName= localStorage.getItem("userName");
const userEmail= localStorage.getItem("userEmail");


  return (
    <div className="flex h-screen bg-black text-white">
      <div className="w-80 border-r border-gray-800 flex flex-col">
        <div className="p-4 flex items-center gap-2 border-b border-gray-800">
          <div className="bg-[#3CEAA4] rounded-md p-1">
            <MessageSquare className="h-6 w-6 text-black" />
          </div>
          <span className="text-xl font-bold text-[#3CEAA4]">blabber</span>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full pl-8 p-2 bg-gray-800 border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3CEAA4] text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Update the contacts list rendering to show loading state */}
        {/* Replace the contacts list div with this: */}
        <div className="flex-1 overflow-y-auto">
          {loading.contacts ? (
            <div className="p-4 text-center text-gray-400">
              <p>Loading contacts...</p>
            </div>
          ) : contacts.length > 0 ? (
            contacts
              .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((contact) => (
                <div key={contact.id} className="border-b border-gray-800">
                  <button
                    className={`w-full p-3 flex items-center gap-3 hover:bg-gray-800 transition-colors ${
                      selectedContact?.id === contact.id ? "bg-gray-800" : ""
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                        <img
                          src={contact.avatar || "/placeholder.svg"}
                          alt={contact.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-black ${
                          contact.status === "online"
                            ? "bg-green-500"
                            : contact.status === "away"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                        }`}
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-xs text-gray-400">
                        {contact.status === "online" ? "Online" : contact.status === "away" ? "Away" : "Offline"}
                      </p>
                    </div>
                  </button>
                </div>
              ))
          ) : (
            <div className="p-4 text-center text-gray-400">
              <p>No contacts available.</p>
              <p>Please check your connection or try again later.</p>
              <button
                onClick={() => {
                  setLoading((prev) => ({ ...prev, contacts: true }))
                  fetch("http://localhost:5000/api/contacts")
                    .then((res) => (res.ok ? res.json() : Promise.reject("Server error")))
                    .then((data) => {
                      if (Array.isArray(data)) setContacts(data)
                      else setContacts([])
                    })
                    .catch((err) => console.error("Error retrying contacts fetch:", err))
                    .finally(() => setLoading((prev) => ({ ...prev, contacts: false })))
                }}
                className="mt-4 px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 text-white"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              <img alt="User" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col">
           
              <span className="text-sm font-medium">{userName}</span>
              <span className="text-xs text-gray-400">{userEmail}</span>
            </div>
            <button className="ml-auto rounded-full p-2 hover:bg-gray-800" onClick={()=>{
            localStorage.clear();
            window.location.href = "/login";
            }
          }>
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {selectedContact ? (
          <>
            {/* Chat header */}
            <div className="h-16 border-b border-gray-800 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    <img
                      src={selectedContact.avatar || "/placeholder.svg"}
                      alt={selectedContact.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black ${
                      selectedContact.status === "online"
                        ? "bg-green-500"
                        : selectedContact.status === "away"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{selectedContact.name}</h3>
                  <p className="text-xs text-gray-400">
                    {selectedContact.status === "online"
                      ? "Online"
                      : selectedContact.status === "away"
                        ? "Away"
                        : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-full hover:bg-gray-800" title="Voice Call">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-800" title="Video Call">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-800" title="More Options">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Update the messages section to show loading state */}
            {/* Find the Messages section and replace with: */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading.messages ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <p>Loading messages...</p>
                  </div>
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.senderId === localStorage.getItem("userId") ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.senderId === localStorage.getItem("userId")
                          ? "bg-[#3CEAA4] text-black"
                          : "bg-gray-800 text-white"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${msg.senderId === localStorage.getItem("userId") ? "text-black/70" : "text-gray-400"}`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-[#3CEAA4] mx-auto mb-4" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat input */}
            <div className="border-t border-gray-800 p-4">
              <div className="flex items-end gap-2">
                <div className="flex-1 bg-gray-800 rounded-lg">
                  <textarea
                    placeholder="Type a message..."
                    className="min-h-[20px] max-h-[120px] w-full bg-gray-800 border-0 rounded-t-lg p-3 focus:outline-none focus:ring-0 text-white resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  />
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-full hover:bg-gray-700">
                        <Smile className="h-5 w-5 text-gray-400" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-700">
                        <Paperclip className="h-5 w-5 text-gray-400" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-700">
                        <Image className="h-5 w-5 text-gray-400" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-700">
                        <Mic className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                    <button
                      className="bg-[#3CEAA4] text-black px-4 py-2 rounded-full flex items-center gap-2 font-medium"
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <Send className="h-4 w-4" />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-[#3CEAA4] mx-auto mb-4" />
              <h3 className="text-xl font-medium">Select a conversation</h3>
              <p className="text-gray-400 mt-2">Choose a contact to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

