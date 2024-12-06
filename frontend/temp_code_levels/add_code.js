import mongoose from '../../backend/node_modules/mongoose/index.js'

const dbConnectionConfig = {
    // Database name goes in the URI e.g. > mongodb://hostname/database?options
    uri: 'mongodb+srv://Wesley:uhsPa6lUo63zxGqW@cluster0.6xjnj.mongodb.net/LargeProject?retryWrites=true&w=majority&appName=Cluster0',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
  };

// Connect to MongoDB
mongoose.connect(dbConnectionConfig.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a schema for the code files
const codeSchema = new mongoose.Schema({
    language: String,
    code: String,
    description: String,
    filename: String,
});

// Create a model based on the schema
const CodeFile = mongoose.model('CodeFile', codeSchema, "Puzzles");

// Function to add a new code file to the database
async function addCodeFile(language, code, description, filename) {
    const newCodeFile = new CodeFile({
        language: language,
        code: code,
        description: description,
        filename: filename,
    });

    await newCodeFile.save();
    console.log(`${filename} added to MongoDB successfully.`);
}

// Code content as a string
const code = `
// Your spaceship's radar system has detected multiple enemy ships approaching.
// To maximize your defense, you must destroy the closest enemy ship!

// Instructions
// Modify this program to calculate the distance of each enemy ship from your spaceship.
// Identify and shoot the closest enemy ship by outputting its name.

// Input
// The total number of enemy ships 'N'
// A list of ship names and their respective distances from your spaceship

// Output
// The name of the closest ship

function main() {
    const prompt = require('prompt-sync')();

    // Getting the number of enemy ships
    const n = parseInt();

    let closestShipName = "";
    let closestDistance = Infinity;

    // Loop to get the name and distance of each enemy ship
    for (let i = 0; i < n; i++) {
        const distance = parseInt();

        // --- User Submission Area ---
        // Update the closest ship if the current one is closer
        // Feel free to modify the logic below to determine the closest ship

    }

    // --- End of User Submission Area ---
}

main();
`;

const description = `
Your spaceship's radar system has detected multiple enemy ships approaching.
To maximize your defense, you must destroy the closest enemy ship!

Instructions
Modify this program to calculate the distance of each enemy ship from your spaceship.
Identify and shoot the closest enemy ship by outputting its name.
Input
The total number of enemy ships 'N'
A list of ship names and their respective distances from your spaceship
Output
The name of the closest ship
`;

// Add the Java code to MongoDB
addCodeFile(
    'JavaScript',
    code,
    description,
    'variables.js'
).then(() => {
    mongoose.connection.close();
});
