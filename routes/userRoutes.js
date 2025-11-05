import express from 'express';
import {
  adminChangePassword,
  createUser,
  loginUser,
  logoutUser,
  sendVerifyOtp,
  verifyOtp
} from '../controllers/authController.js';
import useAuth from '../middlewares/userAuth.js';
import { changePassword } from '../controllers/emplooyeeController.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/sent-verify-otp', useAuth, sendVerifyOtp);
router.post('/verify-otp', useAuth, verifyOtp);
router.post('/reset-verify-otp', useAuth, sendVerifyOtp);
router.put('/change-password',adminChangePassword);

//  Export the router using ESM
export default router;
