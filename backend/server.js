const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://Wesley:uhsPa6lUo63zxGqW@cluster0.6xjnj.mongodb.net/?retryWrites=true&w=majority&appName=Cl=Cluster0"

const client = new MongoClient(url);
client.connect;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => 
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

app.post('/api/signup', async (req, res, next) =>
{
    // Incoming: First name, Last name, Login, Password
    // Outgoing: id, error

    const {firstName, lastName, email, login, password} = req.body;
    const newUser = {FirstName: firstName, LastName: lastName, Email: email, Login: login, Password: password};

    const db = client.db();
    const existingUser = await db.collection('Users').findOne({ Login: login });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this login already exists' });
    }

    const result = await db.collection('Users').insertOne(newUser);

    res.status(200).json({ id: result.insertedId }); // Send the newly created user's ID
});

app.listen(5000); // Start Node + Express server on port 5000s 