import { Router } from "express";
import userServices from "../controller/userController.js";

const router = Router();

// Destructure the users controller methods for easier use
const { getUsers, updateUsers, updateUserEmail } = userServices;

router.get('/', getUsers);
router.put('/update-user', updateUsers);
router.put('/update-email', updateUserEmail);

export default router;