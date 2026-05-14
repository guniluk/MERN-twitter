import express from 'express';
const router = express.Router();
import { protectRoute } from '../middleware/protectRoute.js';
import {
  getUserProfile,
  followUnfollowUser,
  getSuggestedtUsers,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';

router.get('/profile/:username', protectRoute, getUserProfile);
router.get('/suggested', protectRoute, getSuggestedtUsers);
router.post('/follow/:id', protectRoute, followUnfollowUser);
router.post('/update', protectRoute, updateUser);
router.delete('/delete', protectRoute, deleteUser);

export default router;
