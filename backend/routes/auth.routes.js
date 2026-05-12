import express from 'express';
const router = express.Router();
import {
  signupController,
  loginController,
  logoutController,
  getMeController,
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

router.get('/me', protectRoute, getMeController);
router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout', logoutController);

export default router;
