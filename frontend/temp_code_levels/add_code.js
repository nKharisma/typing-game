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
# Your spaceship requires energy crystals to power up for the journey ahead.
# You must mine asteroids to gather as many energy crystals as possible!

# Instructions
# Modify this program to calculate the total number of energy crystals collected.
# Use a loop to collect crystals from each asteroid.

# Input
# The total number of asteroids 'N'
# For each asteroid, the number of energy crystals it contains

# Output
# The total number of energy crystals collected

def main():
    # Getting the number of asteroids
    n = int(input("Enter the number of asteroids: "))

    total_crystals = 0  # Variable to store the total number of crystals

    # --- User Submission Area ---
    # Loop to get the number of crystals from each asteroid

    # --- End of User Submission Area ---

if __name__ == "__main__":
    main()
`;

const description = `
Your spaceship requires energy crystals to power up for the journey ahead.
You must mine asteroids to gather as many energy crystals as possible!

Instructions
Modify this program to calculate the total number of energy crystals collected.
Use a loop to collect crystals from each asteroid.

Input
The total number of asteroids 'N'
For each asteroid, the number of energy crystals it contains

Output
The total number of energy crystals collected
`;

// Add the Java code to MongoDB
addCodeFile(
    'Python',
    code,
    description,
    'loops.py'
).then(() => {
    mongoose.connection.close();
});
