import mongoose, { ObjectId } from 'mongoose';
import { ObjectId as MongoDbObjectId } from 'mongodb';
import { dbConnectionConfig } from './config';

// The maximum length of a string in the database (60 chars since bcrypt's hash function outputs 60 chars).
const maxStringLength = 60;

///////////////////////////////////////////////////////////////////////////////////////////
// Connect to MongoDB database.

function connectToDatabase() {
  mongoose
    .connect(dbConnectionConfig.uri)
    .then(() => {
      console.log('Connected to MongoDB database.');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });
}
connectToDatabase();

///////////////////////////////////////////////////////////////////////////////////////////
// Define User schema and model

const playerData = new mongoose.Schema({
  score: { type: Number, default: 0 },
  highScore: { type: Number, default: 0 },
  wordsPerMinute: { type: Number, default: 0 },
  totalWordsTyped: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  levelsCompleted: { type: Number, default: 0 },
})

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, maxlength: maxStringLength },
  lastName: { type: String, required: true, maxlength: maxStringLength },
  email: { type: String, required: true, maxlength: maxStringLength, unique: true },
  password: { type: String, required: true, maxlength: maxStringLength },
  playerdata: { type: playerData, default: () => ({}) },
  emailVerified: { type: Boolean, default: false },
  emailCode: { type: String, required: true, maxlength: maxStringLength },
  emailCodeTimeout: { type: Number, required: true },
  emailCodeAttempts: { type: Number, required: true },
});

const User = mongoose.model('User', userSchema, 'Users');

///////////////////////////////////////////////////////////////////////////////////////////
// Utility functions

function validateStringFieldLengths(stringFields: Record<string, any>) {
  for (const [fieldName, value] of Object.entries(stringFields)) {
    if (typeof value === 'string' && value.length > maxStringLength) {
      return `stringLengthError: <${fieldName}> must be ${maxStringLength} characters or fewer.`;
    }
  }
  return null;
}

///////////////////////////////////////////////////////////////////////////////////////////
// Database query functions for express server.

// Add user to the Users collection.
async function addUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  emailVerified: boolean,
  emailCode: string,
  emailCodeTimeout: number,
  emailCodeAttempts: number
): Promise<[string | null, any]> {
  // Validate string fields to be correct length.
  const validationError = validateStringFieldLengths({
    firstName,
    lastName,
    email,
    password,
    emailCode,
  });
  if (validationError) {
    return [validationError, null];
  }
  // Create a new user document.
  const user = new User({
    firstName,
    lastName,
    email,
    password,
    emailVerified,
    emailCode,
    emailCodeTimeout,
    emailCodeAttempts
  });

  try {
    const result = await user.save();
    return [null, result];
  } catch (err: any) {
    return [err.message, null];
  }
}

type PlayerDataUpdateParams = {
  score?: number;
  highScore?: number;
  wordsPerMinute?: number;
  totalWordsTyped?: number;
  accuracy?: number;
  levelsCompleted?: number;
};

// Update user in the Users collection.
type UpdateUserParams = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  emailVerified?: boolean;
  emailCode?: string;
  emailCodeTimeout?: number;
  emailCodeAttempts?: number;
  playerdata?: PlayerDataUpdateParams;
};

function flattenUpdateParams(updateParams: any, parentKey = '', result: any = {}) {
  for (const key in updateParams) {
    if (updateParams.hasOwnProperty(key)) {
      const value = updateParams[key];
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        flattenUpdateParams(value, newKey, result);
      } else {
        result[newKey] = value;
      }
    }
  }
  return result;
}

async function updateUser(
  updateParams: UpdateUserParams,
  _id: ObjectId
): Promise<[string | null, any]> {
  // Validate string fields to be correct length.
  const fieldsToValidate = Object.fromEntries(
    Object.entries(updateParams).filter(
      ([_, value]) => typeof value === 'string' && value !== undefined
    )
  );
  const validationError = validateStringFieldLengths(fieldsToValidate);
  if (validationError) {
    return [validationError, null];
  }

  // Flatten the updateParams object to handle nested fields
  const updateObject = flattenUpdateParams(updateParams);

  try {
    const result = await User.findByIdAndUpdate(_id, { $set: updateObject }, { new: true });
    return [null, result];
  } catch (err: any) {
    return [err.message, null];
  }
}

async function updateUserMongo(
  updateParams: UpdateUserParams,
  _id: MongoDbObjectId
): Promise<[string | null, any]> {
  // Validate string fields to be correct length.
  const fieldsToValidate = Object.fromEntries(
    Object.entries(updateParams).filter(
      ([_, value]) => typeof value === 'string' && value !== undefined
    )
  );
  const validationError = validateStringFieldLengths(fieldsToValidate);
  if (validationError) {
    return [validationError, null];
  }

  // Flatten the updateParams object to handle nested fields
  const updateObject = flattenUpdateParams(updateParams);

  try {
    const result = await User.findByIdAndUpdate(_id, { $set: updateObject }, { new: true });
    return [null, result];
  } catch (err: any) {
    return [err.message, null];
  }
}

// Get user based on email and return their info.
async function getUserFromEmail(email: string): Promise<[string | null, any]> {
  // Validate string fields to be correct length.
  const validationError = validateStringFieldLengths({ email });
  if (validationError) {
    return [validationError, null];
  }
  // Query database.
  try {
    const user = await User.findOne({ email }).select(
      '_id firstName lastName password emailVerified emailCode emailCodeTimeout emailCodeAttempts'
    );
    return [null, user];
  } catch (err: any) {
    return [err.message, null];
  }
}

// Get user based on _id and return their info
async function getUserFromId(id: MongoDbObjectId): Promise<[string | null, any]> {
  try {
    const user = await User.findOne({ _id: id }).select(
      '_id firstName lastName password emailVerified emailCode emailCodeTimeout emailCodeAttempts playerdata'
    );
    return [null, user];
  } catch (err: any) {
    return [err.message, null];
  }
}

// Delete user based on userId.
async function deleteUser(_id: ObjectId): Promise<[string | null, any]> {
  // Query database.
  try {
    const result = await User.findByIdAndDelete(_id);
    return [null, result];
  } catch (err: any) {
    return [err.message, null];
  }
}

///////////////////////////////////////////////////////////////////////////////////////////
// Function exports for 'database.ts'.
export { addUser, updateUser, updateUserMongo, getUserFromEmail, getUserFromId, deleteUser };
