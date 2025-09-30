const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

//Part 1: Create an Usee
//define a POST route 
app.post('/users', (req, res) => {
    console.log("Received requested data using POST Method",req.body);

    //process the data from request body
    const {name,email}= req.body;

    //send a response back to client
    res.status(201).json({
        message: 'User created successfully',
        receivedData: {name,email}
    })
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    const upcomingUser = { id: uuidv4(), name, email };
    users.push(upcomingUser);
    res.status(201).json(upcomingUser);
});

//Part 2: Get all users
app.get('/users/:id', (req, res) => {
    //accessing the userId from the request parameters
    const userId = req.params.id;

    //find the user in the database
    const user = users.find(u => u.id === userId);

    if(!user){
        return res.status(404).json({error: 'User not found'});
    }
    res.json(users);
});



// **************************************************************
// Put your implementation here
// If necessary to add imports, please do so in the section above

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