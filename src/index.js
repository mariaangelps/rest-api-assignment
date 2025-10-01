const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

app.use(express.json());

// In-memory store
const users = [];

// POST /users - create a user
app.post('/users', (req, res) => {
  console.log("Received requested data using POST Method", req.body);

  const { name, email } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newUser = { id: uuidv4(), name, email };
  users.push(newUser);
  return res.status(201).json(newUser); // ← return { id, name, email }
});

// GET /users/:id - fetch a user by id
app.get('/users/:id', (req, res) => {
  const { id } = req.params; // ← use :id
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.status(200).json(user); // ← fix typo jsonson → json
});

// PUT /users/:id - update a user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body || {};

  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  users[idx] = { id, name, email };
  return res.status(200).json(users[idx]);
});

// DELETE /users/:id - delete a user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params; // ← use :id
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  users.splice(idx, 1);
  return res.status(204).send(); // ← 204 with no body
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server unless in test
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app;
