import { Router } from "express";
import { signup, verifyOtp, sendOtpController, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/send-otp", sendOtpController);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
