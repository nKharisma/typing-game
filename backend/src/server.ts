const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require('path');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://Wesley:uhsPa6lUo63zxGqW@cluster0.6xjnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const client = new MongoClient(url);
client.connect();

const port = 3000;
const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(bodyParser.json());

app.use((req: any, res: any, next: any) => 
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

app.post('/api/signup', async (req: any, res: any, next: any) =>
{
    // Incoming: First name, Last name, Login, Password
    // Outgoing: id, error

    const {firstName, lastName, email, login, password} = req.body;
    const newUser = {FirstName: firstName, LastName: lastName, Email: email, Login: login, Password: password};

    const db = client.db("LargeProject");
    const existingUser = await db.collection('Users').findOne({ Login: login });

    if (existingUser) {
        return res.status(400).json({ error: 'User with this login already exists' });
    }

    const result = await db.collection('Users').insertOne(newUser);

    // Send the newly created user's ID
    res.status(200).json(
        {
            id: result.insertedId
        });
});

app.post('/api/login', async (req: any, res: any, next: any) => 
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

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, 'client/dist')));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export{};