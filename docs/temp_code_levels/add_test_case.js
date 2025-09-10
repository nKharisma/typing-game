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
const testCaseSchema = new mongoose.Schema({
    ident: String,
    stdin: String,
    expectedOutput: String,
});

// Create a model based on the schema
const TestCase = mongoose.model('TestCase', testCaseSchema, "Test Cases");

// Function to add a new test case to the database
async function addTestCase(name, stdin, expectedOutput) {
    const newTestCase = new TestCase({
        ident: name,
        stdin: stdin,
        expectedOutput: expectedOutput
    });

    await newTestCase.save();
    console.log(`${name} added to MongoDB successfully.`);
}

// Code content as a string
const stdin = `
4
100
120
150
74
`;

const expectedOutput = 444;

// Add the Java code to MongoDB
addTestCase(
    'testCase_loops',
    stdin,
    expectedOutput
).then(() => {
    mongoose.connection.close();
});