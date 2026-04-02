import express from "express";
const router = express.Router();

import {
  sendOTP,
  signUp,
  login,
<<<<<<< HEAD
  // refreshToken,
=======
  refreshToken,
>>>>>>> 89c774f (Initial backend upload)
  changePassword
} from "../controllers/auth.controller.js";

import { resetPassword,resetPasswordToken } from "../controllers/resetPassword.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

router.post("/sendOTP" ,sendOTP);
router.post("/signUp" ,signUp);
router.post("/login" ,login);
<<<<<<< HEAD
// router.get("/refresh-token" ,refreshToken);
=======
router.get("/refresh-token" ,refreshToken);
>>>>>>> 89c774f (Initial backend upload)

router.put("/change-password", auth, changePassword);

router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

<<<<<<< HEAD
export default router;
=======
export default router; 
>>>>>>> 89c774f (Initial backend upload)
