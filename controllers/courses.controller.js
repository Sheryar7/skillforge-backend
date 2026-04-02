<<<<<<< HEAD
import {Category} from "../models/category.model.js";
import {User} from "../models/user.model.js";
import {Course} from "../models/course.model.js"; 
import uploadImageToCloudinary  from "../utils/imageUploader.js";


// Create Course Controller
const createCourse = async (req, res) => {
    try { 
        // 1. FETCH DATA FROM REQUEST BODY 
        const { courseName, courseDescription, whatYouWillLearn, price, tag , category} = req.body;

        // Extract uploaded file (thumbnail image)
        const thumbnail = req.files.thumbnail;
        
        // 2. VALIDATION - CHECK REQUIRED FIELDS 
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail || !tag) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required!',
            });
        }
        
        // 3. FIND INSTRUCTOR DETAILS 
        const userId = req.user.id; // comes from JWT middleware
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details:", instructorDetails);

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: 'Instructor Details Not Found!',
            });
        }
        
        // 4. VALIDATE Category  
        const categoryDetails = await Category.findById(category);
        console.log(categoryDetails);

        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: 'Category Details Not Found!',
            });
        }
        
        // 5. UPLOAD THUMBNAIL TO CLOUDINARY 
        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
        );
        
        // 6. CREATE NEW COURSE ENTRY 
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url, // cloudinary link
        });
        
        // 7. ADD COURSE TO INSTRUCTOR'S PROFILE 
        await User.findByIdAndUpdate(
            instructorDetails._id,
            {
                $push: { courses: newCourse._id }
            },
            { new: true }
        );
        
        // 8. TASK: UPDATE TAG SCHEMA
        // Add this course to the tag's course list 
        await Category.findByIdAndUpdate(
            categoryDetails._id,
            {
                $push: { courses: newCourse._id }
            },
            { new: true }
        );
        
        // 9. RETURN SUCCESS RESPONSE 
        return res.status(200).json({
            success: true,
            message: 'Course Created Successfully!',
            data: newCourse,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to created Course!',
            error: error.message,
        });
    }
};

//showAllCourses controller

const showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true
        }).populate('instructor').exec();

        res.status(200).json({
            success: true,
            message: 'Data for All Courses fetched Successfully',
            allCourses
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: 'Cannot fetch course data',
            error: error.message
        });
    }
}

//get course details controller
=======
import path from "path";
import { Category } from "../models/category.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";
import { Section } from "../models/section.model.js";
import { SubSection } from "../models/subSection.model.js";
import mailSender from "../utils/mailSender.js";
import uploadFile from "../utils/imageUploader.js";


const createCourse = async (req, res) => {
  try {
    console.log("=== CREATE COURSE START ===");
    console.log("req.user:", req.user);
    console.log("FULL BODY:", req.body);
    console.log("req.body keys:", Object.keys(req.body));

    // console.log(req.body)
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      instructions,
      tag,
      category,
    } = req.body; // tag id hogi yaha
    const thumbnail = req.files.thumbnail;
    console.log("thumbnail:", !!thumbnail);

    // console.log(thumbnail)
    if (
      (!courseName ||
        !courseDescription ||
        !whatYouWillLearn ||
        !price ||
        !tag ||
        !thumbnail ||
        !category)
    ) {
      console.log("Missing fields check:");
      console.log("courseName:", !!courseName);
      console.log("courseDescription:", !!courseDescription);
      console.log("whatYouWillLearn:", !!whatYouWillLearn);
      console.log("price:", !!price);
      console.log("tag:", !!tag);
      console.log("thumbnail:", !!thumbnail);
      console.log("category:", !!category);
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    //fetch instructor details
    const userID = req.user.id;
    console.log("userID:", userID);

    // console.log(userID)
    const instructorDetails = await User.findById(userID);
    console.log("instructorDetails found:", !!instructorDetails);

    // console.log(instructorDetails)
    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instructor not found.",
      });
    }
    // validate tag

    // console.log(tag)
    const catDetails = await Category.findById(category); // string hai
    console.log("catDetails found:", !!catDetails);

    // console.log(catDetails)
    if (!catDetails) {
      return res.status(400).json({
        success: false,
        message: "Tag not found.",
      });
    }

    //file upload
    console.log("Uploading thumbnail...");
    const image = await uploadFile(thumbnail, process.env.FOLDER);
    console.log("Image uploaded:", image.secure_url);

    // console.log(image)
    // Parse tags and instructions as arrays
    const parsedTags = JSON.parse(tag);
    const parsedInstructions = JSON.parse(instructions);
    console.log("parsedTags", parsedTags);

    const course = await Course.create({
      courseName: courseName,
      courseDescription: courseDescription,
      whatYouWillLearn: whatYouWillLearn,
      price: price,
      thumbnail: image.secure_url,
      instructor: instructorDetails._id,
      tag: parsedTags,
      instructions: parsedInstructions,
      category: catDetails._id,
    });
    console.log("Course created:", course._id);

    //add course to the user schema of instructor

    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      { $push: { courses: course._id } }
    );
    console.log("Course added to instructor");

    await Category.findByIdAndUpdate(
      { _id: catDetails._id },
      { $push: { courses: course._id } }
    );
    console.log("Course added to category");

    res.status(200).json({
      success: true,
      message: "Course Created.",
      course,
    });
  } catch (error) {
    console.log("=== CREATE COURSE ERROR ===");
    console.log("Error message:", error.message);
    console.log("Error name:", error.name);
    console.log("Stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "something went wrong while creating course.",
      error: error.message,
    });
  }
};

>>>>>>> 89c774f (Initial backend upload)
const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const courseDetaills = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
<<<<<<< HEAD
      .populate("ratingAndReview")
=======
      .populate("ratingAndReviews")
>>>>>>> 89c774f (Initial backend upload)
      .populate("category")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      });
    console.log(courseDetaills);

    if (!courseDetaills) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course found.",
      data: courseDetaills,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching course.",
      error: error,
    });
  }
};

<<<<<<< HEAD
export {createCourse , showAllCourses , getCourseDetails};



=======
const getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({}).populate("instructor").exec();

    res.status(200).json({
      success: true,
      message: "fetched courses.",
      allCourses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Couldn't get any Course.",
      error: error,
    });
  }
};

const editCourse = async (req, res) => {
  try {
    console.log("=== EDIT COURSE START ===");
    console.log("req.body ", req.body);
    console.log("req.files ", req.files);
    console.log("req.user ", req.user);

    const { courseId } = req.body;
    const updates = req.body;
    console.log("courseId:", courseId);
    console.log("updates keys:", Object.keys(updates));

    const course = await Course.findById(courseId);
    console.log("Course found:", !!course);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // console.log("req.files ",req.files)
    if (req.files && req.files.thumbnail) {
      console.log("Processing thumbnail...");
      const thumbnail = req.files.thumbnail;
      const image = await uploadFile(thumbnail, process.env.FOLDER);
      console.log("Thumbnail uploaded:", image.secure_url);
      course.thumbnail = image.secure_url;
    }

    console.log("Starting field updates...");
    for (let key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key) && key !== "courseId") {
        console.log(`Updating field: ${key} = ${updates[key]}`);
        if ((key === "tag" || key === "instructions") && typeof updates[key] === "string") {
          try {
            course[key] = JSON.parse(updates[key]);
            console.log(`Parsed JSON for ${key}:`, course[key]);
          } catch (e) {
            console.log(`Failed to parse ${key}, using as-is`);
            course[key] = updates[key];  // If parsing fails, use as-is
          }
        } else {
          course[key] = updates[key];
        }
      }
    }

    console.log("Saving course...");
    await course.save();
    console.log("Course saved successfully");

    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .populate("ratingAndReviews")
      .exec();
    console.log("Course populated successfully");

    res.status(200).json({
      success: true,
      message: "Course updated.",
      data: updatedCourse,
    });
  } catch (error) {
    console.log("=== EDIT COURSE ERROR ===");
    console.log("Error message:", error.message);
    console.log("Error name:", error.name);
    console.log("Stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error while updating course.",
      error: error.message,
    });
  }
};

const instructorCourses = async (req, res) => {
  try {
    // console.log(req.user)
    const instructorId = req.user.id;

    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 });
    // console.log(instructorCourses)

    res.status(200).json({
      success: true,
      data: instructorCourses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};

const getFullCourse = async (req, res) => {
  try {
    // console.log(req)
    const { courseId } = req.body;
    const userId = req.user.id;
    const course = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .populate("ratingAndReviews")
      .exec();
    if (!course) {
      return res.status(201).json({
        success: false,
        message: `couldn't fetch course with id ${courseId}`,
      });
    }
    const courseProgress = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });
    // console.log("Course Progress ", courseProgress);

    let totalDuration = 0;
    // console.log(course.courseContent)
    course.courseContent?.forEach((section) => {
      section.subSection?.forEach((subSec) => {
        const timeDuration = parseInt(subSec.timeDuration);
        totalDuration += timeDuration;
      });
    });
    function convertSecondsToDuration(totalSeconds) {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return `${hours}h ${minutes}m ${seconds}s`;
    }

    const duration = convertSecondsToDuration(totalDuration);
    console.log('completed Videos', courseProgress?.completedVideos)
    res.status(200).json({
      success: true,
      data: {
        course,
        totalDuration: duration,
        completedVideos: courseProgress?.completedVideos ?? [],
      },
    });
  } catch (error) {
    console.log("Error while getting full course detail", error);
    res.status(500).json({
      success: false,
      message: "Failed to get full course detail",
      error: error.message,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    // console.log("courseId ",courseId)
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    //unEnroll students
    const studentsEnrolled = course.studentsEnrolled;
    for (const student of studentsEnrolled) {
      await User.findByIdAndUpdate(student, { $pull: { courses: courseId } });
    };
    //delete section and subsection
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      //delete subsection
      console.log(sectionId);
      const section = await Section.findById(sectionId);

      if (section) {
        const subSections = section.subSection;
        for (const subSecId of subSections) {
          await SubSection.findByIdAndDelete(subSecId);
        }
      }

      // delete section
      await Section.findByIdAndDelete(sectionId);
    }

    // delete course
    await Course.findByIdAndDelete(courseId);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
    });
  } catch (error) {
    console.log("Error while deleting Instructor's Course", error);
    res.status(500).json({
      success: false,
      message: "Couldn't delete Course",
      error: error,
    });
  }
};

const buyCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    console.log(courseId);

    const userId = req.user.id;
    const email = req.user.email;

    // 1. Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not Found"
      });
    }

    console.log("COURSE:", course);
    // 2. Check already enrolled
    const isEnrolled = course.studentsEnrolled.some(
      (studentId) => studentId.toString() === userId
    );
    if (isEnrolled) {
      return res.status(400).json({
        success: false,
        message: "User already enrolled"
      });
    }

    // 3. Create course progress
    const courseProgress = await CourseProgress.create({
      courseId: courseId,
      userId: userId,
      completedVideos: []
    });

    // 4. Update user
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          courses: courseId,
          courseProgress: courseProgress._id
        }
      },
      { new: true }
    );

    // 5. Update course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { studentsEnrolled: userId } },
      { new: true }
    ).populate("studentsEnrolled");

    console.log("UPDATED COURSE:", updatedCourse);
    // 6. Send mail (optional)
    await mailSender(
      email,
      "Enrollment Mail",
      `Congratulations! You enrolled in ${updatedCourse?.courseName}`
    );

    return res.status(200).json({
      success: true,
      message: "You have been enrolled",
      data: updatedCourse
    });

  } catch (error) {
    console.log("Error while buying Course", error);
    return res.status(500).json({
      success: false,
      message: "Couldn't able to buy this course"
    });
  }
};

const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("userId............. ", userId)
    const enrolledCourses = await Course.find({ studentsEnrolled: userId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .populate("ratingAndReviews")
      .exec();
    if (!enrolledCourses || enrolledCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User has not been enrolled in any of the course"
      })
    }

    res.status(200).json({
      success: true,
      message: "Fetched all enrolled courses",
      data: enrolledCourses
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching enrolled courses",
      error: error.message
    })
  }
};

const unenrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // 1. Check course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // 2. CHECK FIRST
    const isEnrolled = course.studentsEnrolled.some(
      (studentId) => studentId.toString() === userId
    );

    if (!isEnrolled) {
      return res.status(400).json({
        success: false,
        message: "User is not enrolled in this course"
      });
    }

    // 3. Remove student from course
    await Course.findByIdAndUpdate(
      courseId,
      { $pull: { studentsEnrolled: userId } },
      { new: true }
    );

    // 4. Remove course from user
    await User.findByIdAndUpdate(
      userId,
      { $pull: { courses: courseId } },
      { new: true }
    );

    // 5. Delete course progress
    await CourseProgress.findOneAndDelete({
      courseId: courseId,
      userId: userId
    });

    return res.status(200).json({
      success: true,
      message: "Successfully unenrolled from course"
    });

  } catch (error) {
    console.log("Error while unenrolling", error);
    return res.status(500).json({
      success: false,
      message: "Cannot unenroll from course"
    });
  }
};

export {
  createCourse,
  getCourseDetails,
  getAllCourses,
  editCourse,
  instructorCourses,
  getFullCourse,
  deleteCourse,
  buyCourse,
  unenrollCourse,
  getEnrolledCourses
};
>>>>>>> 89c774f (Initial backend upload)
