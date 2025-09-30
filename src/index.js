const express = require('express');
const { randomUUID } = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

// In-memory array to store users
const users = [];

// Middleware to parse JSON bodies
app.use(express.json());

// Part 1: Create a User
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newUser = { id: randomUUID(), name, email };
  users.push(newUser);
  return res.status(201).json(newUser);
});

// Part 2a: Get all users
app.get('/users', (req, res) => {
  res.json(users);
});

// Part 2b: Get one user by ID
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json(user);
});

// Part 3: Update a user by ID
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;

  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) {
    return res.status(404).json({ error: 'User was not found' });
  }

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required fields' });
  }

  // keep the same id
  users[idx] = { id: users[idx].id, name, email };
  return res.json(users[idx]);
});

// Part 4: Delete a user by ID
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const idx = users.findIndex(u => u.id === userId);

  if (idx === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(idx, 1);
  return res.json({ message: 'User deleted successfully' });
});

// Health/root
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Do not touch the code below this comment
// **************************************************************

// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app; // Export the app for testing