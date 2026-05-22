import { Router } from "express";
import { signup, verifyOtp, sendOtpController, forgotPassword } from "../controllers/authController.js";

const router = Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/send-otp", sendOtpController);
router.post("/forgot-password", forgotPassword);

export default router;
