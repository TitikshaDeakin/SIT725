require('dotenv').config(); // Loads variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
const path = require('path');
app.use(express.static(__dirname)); // serve from root

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));


// Mongoose Schema
const Submission = mongoose.model('Submission', new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String
}));

// Route to receive form data
app.post('/api/submit', async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    const newSubmission = new Submission({ firstName, lastName, email });
    await newSubmission.save();
    res.status(200).json({ message: 'Form submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving to database' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

// server.js
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

