// app.js
const path = require('path');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve static assets (adjust if your files live elsewhere)
app.use(express.static(path.join(__dirname)));

// 1) health route (for a quick ping)
app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

// 2) home route (serves your index.html)
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 3) simple form submit API (test target)
// This is intentionally minimal; in your real app you might save to DB.
app.post('/api/submit', (req, res) => {
  const { first_name, last_name, email } = req.body || {};
  if (!first_name || !last_name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  // pretend to “create”
  res.status(201).json({ id: 'demo-1', first_name, last_name, email });
});

// 4) 404 handler for unknown routes
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
