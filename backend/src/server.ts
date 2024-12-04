import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import express from 'express';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { addUser, updateUser, getUserFromEmail, getUserFromId, deleteUser } from './database';
import { devServerPort } from './config';
import { ObjectId } from 'mongoose';
import { ObjectId as MongoDbObjectId } from 'mongodb';


///////////////////////////////////////////////////////////////////////////////////////////
// Secrets and constants
dotenv.config()   // Provides JWT_SECRET, EMAIL_PASSWORD_SECRET
const EMAIL_CODE_TIMEOUT_MINUTES: number = 10;
const MAX_EMAIL_CODE_ATTEMPTS: number = 5;

///////////////////////////////////////////////////////////////////////////////////////////
// Initialize server app.
const expressServer = express();

// Trust the nginx proxy.
expressServer.set('trust proxy', 1);
// Morgan provides express easier docker HTTP logging that default logs to stdout.
expressServer.use(morgan('dev'));
// Allow requests from the following addresses, production and development.
// www.typecode.app is re-routed to typecode.app by nginx setup.
expressServer.use(cors({
    origin: ['https://typecode.app', `http://localhost:${devServerPort}`],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));
// Parse any messages with header 'application/json' with json parser.
expressServer.use(express.json())

///////////////////////////////////////////////////////////////////////////////////////////
// Initialize mailer.
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'typecode.noreply@gmail.com',
    pass: process.env.EMAIL_PASSWORD_SECRET!
  }
})

///////////////////////////////////////////////////////////////////////////////////////////
// Middleware function to call in API endpoints for JWT authentication.
function authenticateToken(req: any, res: any, next: any) {
  const authHeader: string | undefined = req.headers['authorization'];
  if (!authHeader) // No token at all.
  {
    return res.status(400).json({ message: 'Did not find token Authorization header' });
  }
  const token: string | undefined = authHeader.split(' ')[1];
  if (!token) // Doesn't have correct format.
  {
    return res.status(400).json({ message: 'Incorrect format of token Authorization header' });
  }
  jwt.verify(token, process.env.JWT_SECRET!, (err: any, token: any) => {
    if (err)  // Invalid token.
    {
      return res.status(401).json({ message: 'Invalid token', error: err });
    }
    // Any endpoints using this middleware have access to token information.
    // For example 'req.token._id' or 'req.token.firstName'.
    req.token = token;
    next();
  });
}

///////////////////////////////////////////////////////////////////////////////////////////
// Util function to hash and salt passwords (in case of data leaks).
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// Util function to validate password requirements.
function isValidPassword(password: string): boolean {
  // Regular expressions to check each condition
  const lengthCheck = /^.{8,50}$/;        // Between 8 and 50 characters
  const hasCapital = /[A-Z]/;             // At least one uppercase letter
  const hasNumber = /\d/;                 // At least one digit
  const hasSpecialChar = /[!@#$%^&*]/;    // At least one special character

  // Check all conditions
  return (
    lengthCheck.test(password) &&
    hasCapital.test(password) &&
    hasNumber.test(password) &&
    hasSpecialChar.test(password)
  );
}

// Util function to conditionally send response status and message.
function respondIf(condition: boolean, response: any, statusCode: number, message: string, error: string|null = "") {
  if (condition) {
    response.status(statusCode).json({ message: message, error: error });
    return true;
  }
  return false;
}

///////////////////////////////////////////////////////////////////////////////////////////
// Register endpoint.
expressServer.post('/api/v1/user/register', async (req: any, res: any) => {
  const { firstName, lastName, email, password } = req.body;

  // Validate account with email does not already exist.
  const [ getUserErr, getUserResult ] = await getUserFromEmail(email);
  const accountExists: boolean = !(getUserErr) && Boolean(getUserResult);
  if (respondIf(accountExists, res, 400, 'Account already exists with that email. Please try logging in.', getUserErr)) return;
  // Validate password requirements.
  if (respondIf(!isValidPassword(password), res, 400, 'Password does not meet requirements')) return;
  // Validate email is in valid format.
  const emailRegex = /^(?=.{1,50}$)[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);
  if (respondIf(!isValidEmail, res, 400, 'Email does not meet requirements')) return;
  // Validate names are in valid format.
  const nameRegex = /^.{1,50}$/;
  const isValidFirstName: boolean = nameRegex.test(firstName);
  const isValidLastName: boolean = nameRegex.test(lastName);
  if (respondIf(!isValidFirstName || !isValidLastName, res, 400, 'Names do not meet requirements')) return;

  // Capitalize names and hash password.
  const formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  const formattedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
  const hashedPassword = await hashPassword(password);
  // Defaults for newly registered, unverified account.
  const emailVerified = false;
  const emailCode = "-1"
  const emailCodeTimeout = 0;
  const emailCodeAttempts = MAX_EMAIL_CODE_ATTEMPTS;

  // Save user to the database.
  const [ err, _result ] = await addUser(
    formattedFirstName, 
    formattedLastName, 
    email, 
    hashedPassword, 
    emailVerified, 
    emailCode,
    emailCodeTimeout, 
    emailCodeAttempts);
  if (respondIf(Boolean(err), res, 500, 'Server error, try again later...', 'Failed addUser: ' + err)) return;

  res.status(201).json({ message: 'User registered successfully.' });
});

///////////////////////////////////////////////////////////////////////////////////////////
// Send verification code endpoint.
expressServer.post('/api/v1/user/send-verification-code', async (req: any, res: any) => {
  const { email, forceResend } = req.body;
  
  // Validate account exists, get user data.
  const [ getUserErr, getUserResult ] = await getUserFromEmail(email);
  const accountExists: boolean = !getUserErr && getUserResult; 
  if (respondIf(!accountExists, res, 400, 'Server error, try again later...', 'Failed getUserFromEmail: ' + getUserErr)) return;
  // Validate email is not verified.
  const emailVerified: boolean = getUserResult.emailVerified;
  if (respondIf(emailVerified, res, 204, 'Account already verified', 'ACCOUNT_ALREADY_VERIFIED')) return;
  // Validate there is not an existing code, do not create new code on a redirect, do on resend button.
  const isExistingCodeValid: boolean = (Date.now() / 1000) < getUserResult.emailCodeTimeout;
  if (respondIf(isExistingCodeValid && !forceResend, res, 200, 'Existing email code still valid, did not force resend')) return;

  // Generate random email verification code and calculate timeout in unix time.
  const emailCode: string = Math.floor(100000 + Math.random() * 900000).toString();
  const emailCodeTimeout: number = (Math.floor(Date.now() / 1000)) + 60 * EMAIL_CODE_TIMEOUT_MINUTES;
  // Save emailCode to the database.
  console.log(`emailCodeTimeout: ${emailCodeTimeout}`)
  console.log(`_id: ${getUserResult._id}`)
  const [ err, _result ] = await updateUser({ emailCode: emailCode, emailCodeTimeout: emailCodeTimeout, emailCodeAttempts: 0 }, getUserResult._id);
  if (respondIf(Boolean(err), res, 500, 'Server error, try again later...', 'Failed updateUser: ' + err)) return;
  console.log(`From updateUser, err: ${err}`)

  // Send verification email.
  const mailOptions: object = {
    from: 'typecode.noreply@gmail.com',
    to: email,
    subject: 'TypeCode Email Verification',
    text: `Your verification code is: ${emailCode}`
  };
  transporter.sendMail(mailOptions, (err: any, _info: any) => {
    if (err) {
      return res.status(500).json({ message: 'Error sending verification email', error: err.message });
    }
    res.status(201).json({ message: 'Please check your email for verification' });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////
// Check verification code endpoint.
expressServer.post('/api/v1/user/check-verification-code', async (req: any, res: any) => {
  const { email, emailCode } = req.body;
  
  // Validate account exists, get user data.
  const [ getUserErr, getUserResult ] = await getUserFromEmail(email);
  const accountExists: boolean = !getUserErr && getUserResult;
  if (respondIf(!accountExists, res, 400, 'Server error, try again later...', 'Failed getUserFromEmail: ' + getUserErr)) return;
  // Validate email is not verified.
  const emailVerified: boolean = getUserResult.emailVerified;
  if (respondIf(emailVerified, res, 204, 'Account already verified', 'ACCOUNT_ALREADY_VERIFIED')) return;
  // Validate code is not timed out, else frontend will prompt user to press resend code.
  console.log(`emailCodeTimeout: ${getUserResult.emailCodeTimeout}`)
  console.log(`Now: ${Date.now()/1000}`)
  const isCodeTimedOut: boolean = getUserResult.emailCodeTimeout < (Date.now() / 1000);
  if (respondIf(isCodeTimedOut, res, 401, 'Email verification code timed out', 'EMAIL_CODE_TIMEOUT')) return;
  // Validate there are attempts remaining, else frontend will prompt user to press resend code.
  const isAttemptsRemaining: boolean = getUserResult.emailCodeAttempts < MAX_EMAIL_CODE_ATTEMPTS;
  if (respondIf(!isAttemptsRemaining, res, 401, `Email code rejected, all ${MAX_EMAIL_CODE_ATTEMPTS} attempts used`, 'EMAIL_CODE_MAX_ATTEMPTS')) return;

  // Update number of attempts before validating code.
  const numAttempts: number = getUserResult.emailCodeAttempts + 1;
  const [ updateAttemptErr, _updateAttemptResult ] = await updateUser({ emailCodeAttempts: numAttempts }, getUserResult._id);
  if (respondIf(Boolean(updateAttemptErr), res, 500, 'Server error, try again later...', 'Failed updateUser: ' + updateAttemptErr)) return;
  // Validate submitted code.
  const isValidCode: boolean = (emailCode == getUserResult.emailCode);
  if (respondIf(!isValidCode, res, 401, 'Incorrect email verification code. Please try again.')) return;

  // Update email_verified in the database.
  const [ err, _result ] = await updateUser({ emailVerified: true, emailCode: "", emailCodeTimeout: 0, emailCodeAttempts: MAX_EMAIL_CODE_ATTEMPTS }, getUserResult._id);
  if (respondIf(Boolean(err), res, 500, 'Server error, try again later...', 'Failed updateUser: ' + err)) return;

  // Generate JWT.
  const token = jwt.sign(
    { _id: getUserResult._id, email: getUserResult.email, firstName: getUserResult.firstName, lastName: getUserResult.lastName },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" }
  );
  res.status(200).json({ message: 'Verified email successfully', token });
});

///////////////////////////////////////////////////////////////////////////////////////////
// Login endpoint.
expressServer.post('/api/v1/user/login', async (req: any, res: any) => {
  const { email, password } = req.body;

  // Validate account exists, get user data.
  const [ getUserErr, getUserResult ] = await getUserFromEmail(email);
  const accountExists: boolean = !getUserErr && getUserResult;
  if (respondIf(!accountExists, res, 401, 'Invalid email or password', getUserErr)) return;
  // Validate email is verified, else redirect to verify page.
  const emailVerified: boolean = getUserResult.emailVerified;
  if (respondIf(!emailVerified, res, 401, 'Email not verified', 'ACCOUNT_NOT_VERIFIED')) return;
  // Validate password matches.
  const isPasswordCorrect = await bcrypt.compare(password, getUserResult.password);
  if (respondIf(!isPasswordCorrect, res, 401, 'Invalid email or password')) return;

  // Generate JWT.
  const token = jwt.sign(
    { _id: getUserResult._id, email: getUserResult.email, firstName: getUserResult.firstName, lastName: getUserResult.lastName },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" }
  );

  res.status(200).json({ message: 'Login successful', token: token, id: getUserResult._id });
});

///////////////////////////////////////////////////////////////////////////////////////////
// Send password reset code endpoint.
expressServer.post('/api/v1/user/send-password-reset-code', async (req: any, res: any) => {
  const { email } = req.body;

  // NOTE: Since we redirect users immediately if not email verified, we can use emailCode database
  // fields because it is guaranteed the users aren't using those for email verification anymore.

  // Validate account exists, get user data.
  const [ getUserErr, getUserResult ] = await getUserFromEmail(email);
  const accountExists: boolean = !getUserErr && getUserResult;
  if (respondIf(!accountExists, res, 400, 'Email not associated with an account. Please register.', 'Failed getUserFromEmail: ' + getUserErr)) return;
  // Validate email is verified, else redirect to verify page.
  const emailVerified: boolean = getUserResult.emailVerified;
  if (respondIf(!emailVerified, res, 401, 'Email not yet verified', 'ACCOUNT_NOT_VERIFIED')) return;

  // NOTE: If there is an existing code just overwrite it, since the frontend does not automatically 
  // ask for a code on refresh. We know that all requests for codes come straight from user.

  // Generate random email verification code and calculate timeout in unix time.
  const emailCode: string = Math.floor(100000 + Math.random() * 900000).toString();
  const emailCodeTimeout: number = (Math.floor(Date.now() / 1000)) + 60 * EMAIL_CODE_TIMEOUT_MINUTES;
  // Save emailCode to the database.
  const [ err, _result ] = await updateUser({ emailCode: emailCode, emailCodeTimeout: emailCodeTimeout, emailCodeAttempts: 0 }, getUserResult._id);
  if (respondIf(Boolean(err), res, 500, 'Server error, try again later...', 'Failed updateUser: ' + err)) return;
  
  // Send reset code email.
  const mailOptions = {
    from: 'typecode.noreply@gmail.com',
    to: email,
    subject: 'Type Code Password Reset Request',
    text: `Your password reset code is: ${emailCode}\nNot you? Just ignore this email.`
  };
  transporter.sendMail(mailOptions, (err, _info) => {
    if (err) {
      return res.status(500).json({ message: 'Error sending reset code', error: err.message });
    }
    res.status(200).json({ message: `Password reset code sent to email valid until ${emailCodeTimeout}` });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////
// Check password reset code endpoint.
expressServer.post('/api/v1/user/check-password-reset-code', async (req: any, res: any) => {
  const { email, emailCode, newPassword } = req.body;
  
  // Validate account exists, get user data.
  const [ getUserErr, getUserResult ] = await getUserFromEmail(email);
  const accountExists: boolean = !getUserErr && getUserResult;
  if (respondIf(!accountExists, res, 400, 'Server error, try again later...', 'Failed getUserFromEmail' + getUserErr)) return;
  // Validate email is verified, else redirect to verify page.
  const emailVerified: boolean = getUserResult.emailVerified;
  if (respondIf(!emailVerified, res, 401, 'Email not yet verified', 'ACCOUNT_NOT_VERIFIED')) return;
  // Validate code is not timed out, else frontend will prompt user to press resend code.
  const isCodeTimedOut: boolean = getUserResult.emailCodeTimeout < (Date.now() / 1000);
  if (respondIf(isCodeTimedOut, res, 401, 'Email verification code timed out', 'EMAIL_CODE_TIMEOUT')) return;
  // Validate there are attempts remaining, else frontend will prompt user to press resend code.
  const isAttemptsRemaining: boolean = getUserResult.emailCodeAttempts < MAX_EMAIL_CODE_ATTEMPTS;
  if (respondIf(!isAttemptsRemaining, res, 401, `Email code rejected, all ${MAX_EMAIL_CODE_ATTEMPTS} attempts used`, 'EMAIL_CODE_MAX_ATTEMPTS')) return;

  // Update number of attempts before validating code.
  const numAttempts: number = getUserResult.emailCodeAttempts + 1;
  const [ updateAttemptErr, _updateAttemptResult ] = await updateUser({ emailCodeAttempts: numAttempts }, getUserResult._id);
  if (respondIf(Boolean(updateAttemptErr), res, 500, 'Server error, try again later...', 'Failed updateUser: ' + updateAttemptErr)) return;
  // Validate submitted code.
  const isValidCode: boolean = (emailCode == getUserResult.emailCode);
  if (respondIf(!isValidCode, res, 401, 'Incorrect password reset code. Please try again.')) return;
  // Validate password requirements.
  if (respondIf(!isValidPassword(newPassword), res, 400, 'Password does not meet requirements')) return;

  // Update password in the database.
  const hashedPassword: string = await hashPassword(newPassword);
  const [ err, _results ] = await updateUser({ password: hashedPassword, emailCode: "", emailCodeTimeout: 0, emailCodeAttempts: MAX_EMAIL_CODE_ATTEMPTS }, getUserResult._id);
  if (err) {
    return res.status(500).json({ message: 'Server error, try again later...', error: 'Failed updateUser: ' + err });
  }

  res.status(200).json({ message: 'Password reset successfully' });
});

///////////////////////////////////////////////////////////////////////////////////////////
// Delete user endpoint.
expressServer.post('/api/v1/user/delete-user', authenticateToken, async (req: any, res: any) => {
  const _id: ObjectId = req.token._id; 

  // Delete user from the database.
  const [ err, _results ] = await deleteUser(_id);
  if (respondIf(Boolean(err), res, 500, 'Failed to delete user', err)) return;

  res.status(204).json({ message: 'Deleted user successfully' });
});

///////////////////////////////////////////////////////////////////////////////////////////
// get player data endpoint.
expressServer.post('/api/v1/user/get-player-data', async (req: any, res: any) => {
  const { id } = req.body;

  var objectId = MongoDbObjectId.createFromHexString(id);

  const [getUserErr, getUserResult] = await getUserFromId(objectId);
  if (respondIf(Boolean(getUserErr), res, 500, 'Failed to get user', getUserErr)) return;

  res.status(200).json({ 
    score: getUserResult.playerdata.score, 
    highScore: getUserResult.playerdata.score,
    wordsPerMinute: getUserResult.playerdata.wordsPerMinute,
    totalWordsTyped: getUserResult.playerdata.totalWordsTyped,
    accuracy: getUserResult.playerdata.accuracy,
    levelsCompleted: getUserResult.playerdata.levelsCompleted})
});

///////////////////////////////////////////////////////////////////////////////////////////
// Update player data endpoint.
expressServer.post('/api/v1/user/update-player-data', authenticateToken, async (req: any, res: any) => {
  const { score, highScore, wordsPerMinute, totalWordsTyped, accuracy, levelsCompleted } = req.body;
  const _id: ObjectId = req.token._id;
});

///////////////////////////////////////////////////////////////////////////////////////////
// TODO: Refresh tokens stored in cookies, and shorten access token length to 15m





///////////////////////////////////////////////////////////////////////////////////////////
// TypeCode endpoints.
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://Wesley:uhsPa6lUo63zxGqW@cluster0.6xjnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const client = new MongoClient(url);
client.connect();

// expressServer.post('/api/getUser', async (req: any, res: any, next: any) => 
// {
// 	const { id } = req.body;
//
// 	var objectId = MongoDbObjectId.createFromHexString(id)
//
// 	const db = client.db("LargeProject");
//   const user = await db.collection('Users').findOne({ _id: objectId });
//
// 	if (!user) {
//     return res.status(400).json({ error: 'User with the given id does not exist' });
//   }
//
// 	res.status(200).json({ 
//     name: `${user.FirstName} ${user.LastName}`, 
//     login: user.Login,
//     email: user.Email
//   });
// })
expressServer.post('/api/getUser', authenticateToken, async (req: any, res: any) => 
{
	const { email, firstName, lastName } = req.token;

	res.status(200).json({ 
        firstName: firstName, 
        lastName: lastName, 
        email: email
  });
})

// TENTATIVE LEADERBOARD ENDPOINT
expressServer.post('/api/getLeaderboard', async (req: any, res: any, next: any) => {
	// Incoming: 
	// sortBy - string specifying what score value to rank by
	// limit - amount of users to send back
	// Outgoing: list of entries from the 'TestUsers' collection sorted by 'sortby'
	const { sortBy, limit } = req.body;

	// Valid sorting fields
	const validSortingFields = [
		'HighScore',
		'WordsPerMinute',
		'TotalWordsTyped',
		'Accuracy',
		'LevelsCompleted'
	];

	if(!validSortingFields.includes(sortBy)){
		return res.status(400).json({
			error: `'${sortBy}' is an an invalid sortBy field. Valid sorting fields are: ${validSortingFields.toString()}`
		});
	}

	// Set the sorting options
	const sortingOptions: { [key: string]: number } = {}
	sortingOptions[`PlayerData.${sortBy}`] = -1 // -1 indicates sort by descending order in MongoDB

	const db = client.db("LargeProject");

	const users = await db.collection('Users').find(
		{}, // Return all entries
		{ 
			email: 1,
			firstName: 1,
			lastName: 1,
			playerdata: 1
		}
	) // Return these specific values
	.sort(sortingOptions) // Sort by
	.limit(limit) // Limit the output to this # of entries 
	.toArray();

	// create the leaderboard
	const leaderboard = users.map((user: { 
		_id: any; 
		FirstName: any; 
		LastName: any; 
		Login: any; 
		PlayerData: { toObject: () => any; }; }
	) => ({
		id: user._id,
		name: `${user.FirstName} ${user.LastName}`,
		login: user.Login,
		playerData: user.PlayerData
	}));

	// Return the leaederboard
	res.status(200).json({ leaderboard });
})

///////////////////////////////////////////////////////////////////////////////////////////
// Make sure that any request that does not matches a static file
// in the build folder, will just serve index.html. Client side routing is
// going to make sure that the correct content will be loaded.
expressServer.use((req: any, res: any, next: any) => {
  if (/(.ico|.js|.css|.jpg|.png|.map|.svg|.ttf)$/i.test(req.path)) {
    next();
  } else {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.sendFile(path.resolve('./src/client/dist/index.html'));
  }
});

expressServer.use(express.static(path.resolve('./src/client/dist')));

expressServer.use((_: any, res: any) => {
    res.status(200).send('We are under construction... check back soon!');
});


///////////////////////////////////////////////////////////////////////////////////////////
// Function exports for 'server.ts'.
export { expressServer };
