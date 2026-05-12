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

///routes///
import authRoutes from './routes/auth.routes.js';
app.use('/api/auth', authRoutes);

///db connect & server start///
import connectMongoDB from './db/connectMongoDB.js';
app.listen(PORT, () => {
  connectMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
