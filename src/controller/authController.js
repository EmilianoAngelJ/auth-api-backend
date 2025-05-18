import { db } from '../db/database.js';
import axios from 'axios';
import admin from 'firebase-admin';

// Controller for user signup
const signupUser = async (req, res) => {
    // Extract user data from request body
    const { email, password, name, surnames, gender, birthdayIso, IsoCode, phoneNumber } = req.body;

    try {
        // Create user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
        });

        const uid = userRecord.uid;
        
        // Authenticate the user to get tokens using Firebase REST API
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
            {
                email,
                password,
                returnSecureToken: true
            }
        );

        // Retrieve idToken and refreshToken from response
        const idToken = response.data.idToken;
        const refreshToken = response.data.refreshToken;

        // Convert birthday from ISO string to Firestore Timestamp
        const birthdayDate = new Date(birthdayIso);
        const birthday = admin.firestore.Timestamp.fromDate(birthdayDate);

        // Save user details in Firestore under 'users' collection
        await db.runTransaction(async (transaction) => {
            const docRef = db.collection('users').doc(uid);
            transaction.set(docRef, {
                name,
                email,
                surnames,
                gender,
                birthday,
                phoneNumber,
                IsoCode,
            });
        });

        // Send success response with tokens
        res.status(201).json({
            message: 'User registered',
            idToken,
            refreshToken
        });

    } catch (error) {
        // Handle specific Firebase Auth errors
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({ error: 'Email already in use' });
        } else if (error.code === 'auth/invalid-password') {
            return res.status(400).json({ error: 'Invalid password' });
        } else if (error.code === 'auth/invalid-email') {
            return res.status(400).json({ error: 'Invalid email' });
        }

        // Handle unexpected errors
        return res.status(500).json({ error: 'Server error' });
    }
};

// Controller for user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Authenticate user with Firebase REST API
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
            {
                email,
                password,
                returnSecureToken: true
            }
        );

        // Extract tokens from response
        const idToken = response.data.idToken;
        const refreshToken = response.data.refreshToken;

        // Send success response with tokens
        res.status(200).json({ idToken, refreshToken });

    } catch (error) {
        // Log and handle failed authentication
        console.error('Error during login:', error.response ? error.response.data : error.message);
        res.status(401).json({ error: 'Invalid credentials' });
    }
};

// Controller to refresh authentication tokens
const refreshAuthTokens = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        // Exchange refreshToken for a new idToken using Firebase secure token endpoint
        const response = await axios.post(
            `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`,
            {
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            }
        );

        // Extract new tokens from response
        const newIdToken = response.data.id_token;
        const newRefreshToken = response.data.refresh_token;

        // Send new tokens
        res.status(200).json({ idToken: newIdToken, refreshToken: newRefreshToken });

    } catch (error) {
        // Log and handle token refresh errors
        console.error('Error refreshing token:', error.response ? error.response.data : error.message);
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};

// Export controllers
export default {
    signupUser,
    loginUser,
    refreshAuthTokens
};
