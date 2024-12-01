import dotenv from 'dotenv';


///////////////////////////////////////////////////////////////////////////////////////////
// Provides DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
dotenv.config()

///////////////////////////////////////////////////////////////////////////////////////////
// Function exports for 'database.ts'.

const dbConnectionConfig = {
  // Database name goes in the URI e.g. > mongodb://hostname/database?options
  uri: 'mongodb+srv://Wesley:uhsPa6lUo63zxGqW@cluster0.6xjnj.mongodb.net/LargeProject?retryWrites=true&w=majority&appName=Cluster0',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
};
const serverPort = 5000;
const devServerPort = 5173;

export {
  dbConnectionConfig,
  serverPort,
  devServerPort,
};
