import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoute.js';


const app = express();

// DB Connection
connectDB();

const PORT = process.env.PORT || 4000;

// Middleware
// parse json
app.use(express.json());
// parse cookie
app.use(cookieParser());

//to avoid undefined
app.use(cors({
  origin:'http://localhost:5173',
  credentials: true
}));

app.get('/', (req, res) => {res.send({ msg: "welcome" });});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});