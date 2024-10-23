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
    // Incoming: Name, Email, Login, Password
    // Outgoing: id, error

    const {name, email, login, password} = req.body;
    const newUser = {Name: name, Email: email, Login: login, Password: password};

    const db = client.db();
    const existingUser = await db.collection('Users').findOne({ Login: login });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this login already exists' });
    }

    const result = await db.collection('Users').insertOne(newUser);

    res.status(200).json({ id: result.insertedId }); // Send the newly created user's ID
});

app.post('/api/login', async (req, res, next) => 
{
    
    const { login, password } = req.body;
    
    const db = client.db();
    const user = await db.collection('Users').findOne({ Login: login, Password: password });
    
    if (!user) {
        return res.status(400).json({ error: 'Invalid login or password' });
    }
    
    //send user info if login is successful.
    res.status(200).json({ 
        id: user._id, 
        name: user.Name, 
        email: user.Email 
    });
});
app.listen(5000); // Start Node + Express server on port 5000s 