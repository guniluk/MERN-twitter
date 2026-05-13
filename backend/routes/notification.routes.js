import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import {
  getAllNotifications,
  deleteNotifications,
  deleteOneNotification,
} from '../controllers/notification.controller.js';

const route = express.Router();

route.get('/', protectRoute, getAllNotifications);
route.delete('/', protectRoute, deleteNotifications);
route.delete('/:id', protectRoute, deleteOneNotification);

export default route;
