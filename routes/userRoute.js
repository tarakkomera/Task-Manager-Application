import express from 'express';
import { getCurrentUser, loginUser,registerUser,updateUserPassword,updateUserProfile } from '../controllers/userController.js';

import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);


userRouter.get('/me' ,authMiddleware , getCurrentUser);
userRouter.put('/profile',authMiddleware , updateUserProfile);
userRouter.put('/password'  ,authMiddleware , updateUserPassword);


export default userRouter;