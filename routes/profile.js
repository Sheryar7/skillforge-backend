<<<<<<< HEAD
import express from "express";
const router = express.Router();
import { updateProfile , deleteAccount , getAllUserDetails } from "../controllers/profile.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

router.post("/updateProfile",auth,updateProfile);
router.delete("/deleteAccount",auth, deleteAccount);
router.get("/getAllUserDetails",auth, getAllUserDetails);

export default router; 

//updateProfile deleteAccount getAllUserDetails
=======
import express from "express"
const router = express.Router()
import {deleteAccount,updateProfile, updateProfilePic, getUserData, instructorDashboard} from "../controllers/profile.controller.js"
import { becomeInstructor } from "../controllers/profile.controller.js"
import { auth } from "../middlewares/auth.middleware.js"


router.post("/updateProfile",auth,updateProfile)
router.delete("/deleteProfile",auth, deleteAccount)
router.post("/updateProfilePicture",auth, updateProfilePic)
router.post("/become-instructor", auth, becomeInstructor);
router.get("/getUserData",auth, getUserData)
router.get("/instructorDashboard",auth, instructorDashboard)

export default router;
>>>>>>> 89c774f (Initial backend upload)
