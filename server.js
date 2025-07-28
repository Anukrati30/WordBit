const express = require('express');
const mongoose = require('mongoose');
const Word = require('./models/Word'); // ✅ No .js needed but fine either way
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/your-db-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Routes
app.post('/api/words', async (req, res) => {
  try {
    const word = new Word(req.body);
    await word.save();
    res.status(201).json(word);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
