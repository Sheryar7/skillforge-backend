<<<<<<< HEAD
import {Profile} from "../models/profile.model.js";
import {User} from "../models/user.model.js";
// const Course = require('../models/Course');
 
const updateProfile = async (req, res) => {
    try {
        //data fetch
        const { dateOfBirth = "", about = "", gender, contactNumber } = req.body;
        //get userId
        const id = req.user.id;
        //validation
        if (!gender || !contactNumber || !id) {
            return res.status(400).json({
                success: false,
                message: 'All Field Required!',
            });
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        //update profile in DB
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        profileDetails.save();
        
        //return res
        return res.status(200).json({
            success: true,
            message: 'Profile created successfully.',
            profileDetails,
        });
    } catch (error) {
        console.error('Error in Updating Profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while Updating Profile!',
            error: error.message,
        });
    }
}
 
const deleteAccount = async (req, res) => {
    try {
        // get user id from req.user (comes from auth middleware)
        const id = req.user.id; 
        //validation
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: 'User Not Found!'
            });
        }
        // delete profile document using profile ObjectId stored in userDetails
        await Profile.findByIdAndDelete(userDetails.additionalDetails);     //this is the best one / clean and correct
        // await Profile.findByIdAndDelete({_id:userDetails.additionalDetails}); babbar bhai did this in tutorial / ✔ Option 2 (Object filter form) / This also works, but unnecessary.
        
        await User.findByIdAndDelete({_id:id});
        //return res
        return res.status(200).json({
            success: true,
            message: 'Account Deleted Successfully.', 
        });
    } catch (error) {
        console.error('Error in Deleting Account:', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while Deleting Account!',
            error: error.message,
        });
    }
}

const getAllUserDetails = async (req, res) => {
    try {
        // Get user ID from token (auth middleware)
        const id = req.user.id;

        // Fetch user and also populate the profile
        const userDetails = await User.findById(id)
            .populate("additionalDetails")   // get profile info
            .exec();

        // If user doesn't exist
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        // Return the user details
        return res.status(200).json({
            success: true,
            message: "User Data Fetched Successfully.",
            data: userDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export{updateProfile , deleteAccount , getAllUserDetails};
=======
import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";
import uploadFile from "../utils/imageUploader.js";
import { Course } from '../models/course.model.js'

const updateProfile = async (req, res) => {
  try {
    const { gender = "", dateOfBirth = "", about, contactNumber } = req.body;

    // profile ki id k base pe update krna hai pr id sirf user ki hai
    // tho user schema se profile ki id nikal k profile updaye karengy
    const id = req.user.id;
    console.log(id)
    const user = await User.findById({ _id: id });
    const updatedProfile = await Profile.findByIdAndUpdate(
      { _id: user.additionalDetails },
      {
        gender: gender,
        dateOfBirth: dateOfBirth,
        about: about,
        contactNumber: contactNumber,
      }, { new: true }
    );

    res.status(200).json({
      success: true,
      message: "profile updated successfully.",
      updatedProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the prpfile.",
      error: error,
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    //get user id
    //validate
    // delete profile first
    // delete user and return res

    const id = req.user.id
    console.log(id)
    const user = await User.findById(id)

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    //dlt profile
    await Profile.findByIdAndDelete({ _id: user.additionalDetails })
    // dlt fron enrolled users
    //dlt user
    await User.findByIdAndDelete({ _id: id })

    res.status(200).json({
      success: true,
      message: "Account deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the Account.",
      error: error,
    });
  }
}

const updateProfilePic = async (req, res) => {
  try {
    console.log("Checking uploaded file", req.files);
    const file = req.files.profile; // Directly accessing req.file if handling a single file upload
    console.log(file);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    // Assume `updateProfile` is a function that processes the uploaded file
    const response = await uploadFile(file, process.env.FOLDER);
    // console.log("response", response);

    const userId = req.user.id;
    console.log("user: ", userId)
    const user = await User.findByIdAndUpdate({ _id: userId }, { image: response.secure_url }, { new: true })

    res.status(200).json({
      success: true,
      message: "Updated Profile Picture.",
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Couldn't update Profile Picture.",
      error: error.message,
    });
  }
};

const getUserData = async (req, res) => {
  try {
    const id = req.user.id;
    console.log(id)
    const user = await User.findById(id).populate("additionalDetails");

    if (user) {
      res.status(200).json({
        success: true,
        message: "User data fetched!",
        data: user

      })
    } else {
      res.status(404).json({
        success: false,
        message: "User data not found!",

      })
    }
  } catch (error) {
    res.status(505).json({
      success: false,
      message: "something went wrong while fetching user data",
      error: error

    })

  }
}

const instructorDashboard = async (req, res) => {
  try {

    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled ? course.studentsEnrolled.length : 0;
      const totalAmount = totalStudentsEnrolled * (course.price || 0);

      const courseInfo = {
        _id: course._id,
        courseName: course.courseName || course.courseTitle || "Untitled Course",
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmount,
      };
      return courseInfo;
    });

    res.status(200).json({ courses: courseData });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const becomeInstructor = async (req, res) => {
  try {
    const userId = req.user.id; // coming from auth middleware

    // find user
    const user = await User.findById(userId);
    console.log("[BecomeInstructor] UserId:", userId, "Current accountType:", user?.accountType);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // already instructor check
    if (user.accountType === "Instructor") {
      console.log("[BecomeInstructor] Already instructor for user:", userId);
      return res.status(400).json({
        success: false,
        message: "You are already an Instructor",
      });
    }

    // update role
    user.accountType = "Instructor";
    await user.save();
    // Debug log to verify user is updated
    console.log("[BecomeInstructor] User after upgrade:", userId, user.accountType);

    // remove password before sending
    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "You are now an Instructor",
      user,
    });
  } catch (error) {
    console.error("Become Instructor Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to become instructor",
    });
  }
};

export {
  updateProfile,
  deleteAccount,
  updateProfilePic,
  getUserData,
  instructorDashboard,
  becomeInstructor
};
>>>>>>> 89c774f (Initial backend upload)
