import { Router } from "express";
import contactServices from "../controller/contactsController.js";

const router = Router();

// Destructure the contacts controller methods for easier use
const { getContacts, createContact, deleteContact} = contactServices;

router.get('/', getContacts);
router.post('/create-contact', createContact)
router.delete('/delete-contact/:contactId', deleteContact)

export default router;