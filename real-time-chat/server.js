const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chatApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error(err));

// Serve static files
app.use(express.static('public'));

// Socket.IO events
io.on('connection', (socket) => {
  console.log('🔌 New client connected');

  socket.on('joinRoom', async (room) => {
    socket.join(room);
    const messages = await Message.find({ room }).sort({ timestamp: 1 }).limit(50);
    socket.emit('loadMessages', messages);
  });

  socket.on('chatMessage', async ({ sender, message, room }) => {
    const newMsg = new Message({ sender, message, room });
    await newMsg.save();
    io.to(room).emit('message', newMsg);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
