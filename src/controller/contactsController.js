import { db } from "../db/database.js";
import admin from "firebase-admin";

// Get all contacts belonging to the authenticated user
const getContacts = async (req, res) => {
    const idToken = req.headers.authorization?.split(" ")[1];

    if (!idToken) {
        return res.status(401).json({ message: "Token not provided" });
    }

    try {
        // Verify token and extract user ID
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        const contacts = [];

        // Query Firestore for contacts belonging to the user
        const contactsSnapshot = await db
            .collection('contacts')
            .where('uid', '==', uid)
            .get();

        // Push contact data into array with their document ID
        contactsSnapshot.forEach((contactDoc) => {
            contacts.push({
                contactId: contactDoc.id,
                ...contactDoc.data(),
            });
        });

        // Return the user's contacts
        return res.status(200).json(contacts);

    } catch (error) {
        console.error("Error fetching contacts:", error);
        return res.status(500).json({ message: "Error fetching contacts" });
    }
};

// Create a new contact for the authenticated user
const createContact = async (req, res) => {
    const idToken = req.headers.authorization?.split(" ")[1];
    const { name, contactType } = req.body;

    if (!idToken) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        // Verify token and extract user ID
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // Reference to the contacts collection
        const contactReference = db.collection('contacts');

        // Add new contact document with timestamp
        const docRef = await contactReference.add({
            uid,
            contactType,
            name,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Return success message and new contact ID
        return res.status(200).json({ message: 'Contact added', contactId: docRef.id });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error while registering contact' });
    }
};

// Delete a contact by ID if it belongs to the authenticated user
const deleteContact = async (req, res) => {
    const idToken = req.headers.authorization?.split(" ")[1];
    const { contactId } = req.params;

    if (!idToken) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        // Verify token and extract user ID
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        const contactRef = db.collection('contacts').doc(contactId);
        const contactDoc = await contactRef.get();

        // Check if contact exists
        if (!contactDoc.exists) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Ensure the contact belongs to the authenticated user
        if (contactDoc.data().uid !== uid) {
            return res.status(403).json({ message: 'Not authorized to delete this contact' });
        }

        // Delete the contact document
        await contactRef.delete();

        return res.status(200).json({ message: 'Contact deleted' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error while deleting contact' });
    }
};

export default { getContacts, createContact, deleteContact };
