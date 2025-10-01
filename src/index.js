const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// **************************************************************
// Put your implementation here
// If necessary to add imports, please do so in the section above

const users = []; // In-memory array to store users

//Part 1: Create an Usee
//define a POST route 
app.post('/users', (req, res) => {
    console.log("Received requested data using POST Method",req.body);

    //process the data from request body
    const { name, email } = req.body || {};

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    const upcomingUser = { id: uuidv4(), name, email };
    users.push(upcomingUser);
    //send a response back to client
    return res.status(201).json(upcomingUser);
    
});

//Part 2: Get all users
app.get('/users/:id', (req, res) => {
    //accessing the userId from the request parameters
    const { id } = req.params;
    //find the user in the database
    const user = users.find(u => u.id === id);
    if(!user) return res.status(404).json({error: 'User not found'});
    return res.status(200).json(user);
});

//Part 3: Update a user by ID
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
  


//Step 4: Delete a user by ID
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex(u => u.id === id);
    if(userIndex === -1){
        return res.status(404).json({error: 'User not found'});
    }
    users.splice(userIndex,1);
    return res.status(204).send();
});



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