import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { getData } from '../controllers/userController.js';


const userRouter = express.Router();

userRouter.get("/data", userAuth, getData)

export default userRouter;
