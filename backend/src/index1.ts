const { MongoClient } = require('mongodb');

// Replace <db_password> with your actual password
const uri = "mongodb+srv://Wesley:uhsPa6lUo63zxGqW@cluster0.6xjnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function connectDB() {
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log("Connected to the database!");

        // Access the desired database
        const database = client.db("LargeProject");  // Ensure this matches the actual database name
        const usersCollection = database.collection("Users");
        const playerDataCollection = database.collection("PlayerData");
        const leaderboardCollection = database.collection("Leaderboard");

        // Retrieve all documents from Users collection
        console.log("Users:");
        const usersCursor = usersCollection.find();  // find() returns a cursor for all matching documents
        await usersCursor.forEach((user: any) => console.log(user));  // Loop through the cursor and print each document

	console.log("\n\n");

        // Retrieve all documents from playerData collection
        console.log("Player Data:");
        const playerDataCursor = playerDataCollection.find();  // find() returns a cursor for all documents
        await playerDataCursor.forEach((playerData: any) => console.log(playerData));

	console.log("\n\n");

        // Retrieve all documents from leaderboard collection
        console.log("Leaderboard:");
        const leaderboardCursor = leaderboardCollection.find();  // find() returns a cursor for all documents
        await leaderboardCursor.forEach((leaderboardEntry: any) => console.log(leaderboardEntry));

    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    } finally {
        // Close the connection
        await client.close();
    }
}

connectDB();