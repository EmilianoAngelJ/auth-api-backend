import { Router } from 'express';
import authServices from '../controller/authController.js';

const router = Router();

// Destructure the authentication controller methods for easier use
const { signupUser, loginUser, refreshAuthTokens } = authServices;

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/refresh-tokens', refreshAuthTokens);

export default router; 