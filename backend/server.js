///express///
import express from 'express';
export const app = express();
app.use(express.json()); //parse req
app.use(express.urlencoded({ extended: true })); //parse form data

///cookie-parser///
import cookieParser from 'cookie-parser';
app.use(cookieParser());

///cors///
import cors from 'cors';
app.use(cors());

///dotenv///
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 5001;

///cloudinary///
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

///routes///
import authRoutes from './routes/auth.routes.js';
app.use('/api/auth', authRoutes);
import userRoutes from './routes/user.routes.js';
app.use('/api/users', userRoutes);
import postRoutes from './routes/post.routes.js';
app.use('/api/posts', postRoutes);

///db connect & server start///
import connectMongoDB from './db/connectMongoDB.js';
app.listen(PORT, () => {
  connectMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
