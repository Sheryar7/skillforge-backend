import express from "express";
import { auth, isAdmin, isInstructor, isStudent } from "../middlewares/auth.middleware.js";
import { createRating, getAvgRating, getAllRatings} from "../controllers/ratingAndReview.controller.js"
import { createCategory, showAllCategories, categoryPageDetails } from "../controllers/category.controller.js";
import { createSection, updateSection, deleteSection } from "../controllers/section.controller.js"
import { createCourse, getCourseDetails, getAllCourses, editCourse, instructorCourses, getFullCourse, deleteCourse, buyCourse, getEnrolledCourses , unenrollCourse} from "../controllers/courses.controller.js"
import { createSubSec, updateSubSec, deleteSubSec } from "../controllers/subsection.controller.js";
import { updateCrourseProgress, getCourseProgess } from "../controllers/courseProgress.controller.js";
const router = express.Router();

router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.delete("/deleteSection", auth, isInstructor, deleteSection);

router.post("/createCourse", auth, isInstructor, createCourse);
router.post("/getCourseDetails", getCourseDetails)
router.post("/editCourse", auth, isInstructor, editCourse)
router.get("/getAllCourses", getAllCourses)
router.get("/getInstructorCourse",auth, instructorCourses)
router.post("/getFullCourseDetails",auth, getFullCourse)
router.delete("/deleteCourse", auth, isInstructor, deleteCourse)
router.post("/buyCourse", auth, isStudent, buyCourse)
router.post("/unenrollCourse", auth, isStudent, unenrollCourse);
router.get("/getEnrolledCourses", auth, getEnrolledCourses)

router.post("/addSubSection", auth, isInstructor, createSubSec);
router.post("/updateSubSection", auth, isInstructor, updateSubSec);
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSec);

router.post("/createCategory",auth, isAdmin, createCategory);
router.get("/getCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAvgRating", getAvgRating);
router.get("/getRating", getAllRatings);

router.post("/update-courseProgress", auth, isStudent, updateCrourseProgress);
router.post("/get-courseProgress", auth, isStudent, getCourseProgess);

export default router;
