import { db } from '../db/database.js';
import admin from 'firebase-admin';

// Get authenticated user's data
const getUsers = async (req, res) => {
  const idToken = req.headers.authorization?.split(" ")[1];

  if (!idToken) {
    return res.status(401).json({ message: "Token not provided." });
  }

  try {
    // Verify the token and get the user ID (uid)
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Query user document from Firestore
    const doc = await db.collection("users").doc(uid).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return user data
    return res.status(200).json({ id: doc.id, ...doc.data() });

  } catch (error) {
    console.error(error);
    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({ message: "Session expired" });
    }
    return res.status(500).json({ message: "Error fetching user data" });
  }
};

// Update authenticated user's profile data
const updateUsers = async (req, res) => {
  const idToken = req.headers.authorization?.split(' ')[1];
  const { name, surnames, gender, birthdayIso, IsoCode, phoneNumber } = req.body;

  if (!idToken) {
    return res.status(401).json({ message: "Token not provided." });
  }

  try {
    // Verify token and get uid
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const docRef = db.collection('users').doc(uid);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Convert birthday from ISO 8601 string to Firestore Timestamp
    const birthdayDate = new Date(birthdayIso);
    const birthday = admin.firestore.Timestamp.fromDate(birthdayDate);

    // Update user document in Firestore
    await docRef.update({
      name,
      surnames,
      gender,
      birthday,
      IsoCode,
      phoneNumber,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ message: 'Successfully updated' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error updating user' });
  }
};

// Re-authentication and email update.
// To be changed to client-side
const updateUserEmail = async (req, res) => {
  const { newEmail, password } = req.body;
  const idToken = req.headers.authorization?.split(' ')[1];

  try {
    // Verify token and get uid
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const user = firebase.getAuth().currentUser;
    const credential = firebase.EmailAuthProvider.credential(user.email, password);
    await firebase.reauthenticateWithCredential(user, credential);
    await user.updateEmail(newEmail);
    await firebase.reload(user);

    res.json({ message: 'Email successfully updated.' });

  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ message: 'Error updating email.', error: error.message });
  }
};

export default { getUsers, updateUsers, updateUserEmail };
