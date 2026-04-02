import express from "express";
const router = express.Router();

import {
  sendOTP,
  signUp,
  login,
  refreshToken,
  changePassword
} from "../controllers/auth.controller.js";

import { resetPassword,resetPasswordToken } from "../controllers/resetPassword.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

router.post("/sendOTP" ,sendOTP);
router.post("/signUp" ,signUp);
router.post("/login" ,login);
router.get("/refresh-token" ,refreshToken);

router.put("/change-password", auth, changePassword);

router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

export default router;
