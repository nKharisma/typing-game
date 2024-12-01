import dotenv from 'dotenv';


///////////////////////////////////////////////////////////////////////////////////////////
// Provides DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
dotenv.config()

///////////////////////////////////////////////////////////////////////////////////////////
// Function exports for 'database.ts'.

const dbConnectionConfig = {
  uri: 'mongodb+srv://Wesley:uhsPa6lUo63zxGqW@cluster0.6xjnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
};
const serverPort = 5000;
const devServerPort = 5173;

export {
  dbConnectionConfig,
  serverPort,
  devServerPort,
};
