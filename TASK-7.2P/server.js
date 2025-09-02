// server.js

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const http = require('http');

const app = express();
const server = http.createServer(app);              // <-- raw HTTP server (needed for Socket.IO)

// --- Socket.IO ---
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });

// --- Middleware & static ---
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname));                 // serve index.html and /js/*

// --- Views/Routes ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// --- MongoDB connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// --- Mongoose Model ---
const Submission = mongoose.model('Submission', new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String
}));

// --- API route ---
app.post('/api/submit', async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const doc = new Submission({ firstName, lastName, email });
    await doc.save();
    res.status(200).json({ message: 'Form submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving to database' });
  }
});

// --- Socket behavior ---
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // demo event: emit a random number every second
  const t = setInterval(() => {
    socket.emit('number', Math.floor(Math.random() * 100));
  }, 1000);

  socket.on('disconnect', () => {
    clearInterval(t);
    console.log('user disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// Export server for tests (mocha/supertest)
module.exports = server;
