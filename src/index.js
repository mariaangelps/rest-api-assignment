const express = require('express');
// Use the CommonJS build of uuid so Jest doesn't choke on ESM
const { v4: uuidv4 } = require('uuid/dist/cjs');

const app = express();
const port = 3000;

app.use(express.json());

// In-memory store
const users = [];

/**
 * POST /users
 * Body: { name, email }
 * Return 201 with { id, name, email }
 * 400 if missing fields
 */
app.post('/users', (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const newUser = { id: uuidv4(), name, email };
  users.push(newUser);
  return res.status(201).json(newUser);
});

/**
 * GET /users/:id
 * Return 200 with the user
 * 404 if not found
 */
app.get('/users/:id', (req, res) => {
  const { id } = req.params;                // <-- use params.id
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.status(200).json(user);        // <-- return the user object
});

/**
 * PUT /users/:id
 * Body: { name, email }
 * Return 200 with updated user
 * 404 if not found, 400 if missing fields
 */
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

/**
 * DELETE /users/:id
 * Return 204 No Content on success
 * 404 if not found
 */
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;                // <-- use params.id
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  users.splice(idx, 1);
  return res.status(204).send();            // <-- no body for 204
});

// Optional root
app.get('/', (req, res) => res.send('Hello World!'));

// Start server unless running tests
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
}

module.exports = app;
