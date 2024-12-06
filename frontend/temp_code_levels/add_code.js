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

// Your Java code content as a string
const javaCode = `
import java.util.Scanner;

class VariablesAnswer {
    public static void main(String args[]) {
        Scanner scanner = new Scanner(System.in);
        
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

        // Getting the number of enemy ships
        int n = scanner.nextInt();
        scanner.nextLine(); // Consume the newline character

        String closestShipName = "";
        int closestDistance = Integer.MAX_VALUE;

        // Loop to get the name and distance of each enemy ship
        for (int i = 0; i < n; i++) {
            String shipName = scanner.nextLine();
            
            int distance = scanner.nextInt();
            scanner.nextLine(); // Consume the newline character

            // --- User Submission Area ---
            // Update the closest ship if the current one is closer
            // Feel free to modify the logic below to determine the closest ship
        }
        
        // --- End of User Submission Area ---
        
        // Closing scanner
        scanner.close();
    }
}
`;

// Add the Java code to MongoDB
addCodeFile(
    'Java',
    javaCode,
    'Java program to determine and shoot the closest enemy ship.',
    'VariablesAnswer.java'
).then(() => {
    mongoose.connection.close();
});
