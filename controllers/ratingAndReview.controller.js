import mongoose from "mongoose";
import {RatingAndReview} from "../models/ratingAndReview.model.js";
import {Course} from "../models/course.model.js";

//create rating
const createRating = async (req, res) => {
    try {
        //get user
        const userId = req.user.id;
        //fetch data
        const { rating, review, courseId } = req.body;
        //check if user already Enrolled
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } }
            // studentsEnrolled: userId
        });
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Student is not enrolled in the course!'
            });
        };
        //check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        });
        if (alreadyReviewed) {
            return res.status(404).json({
                success: false,
                message: 'Course is already reiewed by the user!'
            });
        }
        //create rating and review
        const ratingReview = await RatingAndReview.create({
            course: courseId,
            user: userId,
            rating,
            review
        });
        //update course with this rating and review 
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                }
            },
            { new: true });

        console.log(updatedCourseDetails);
        //return res
        return res.status(200).json({
            success: true,
            ratingReview,
            message: 'Rating and Review Created Successfully.'
        });

    } catch (error) {
        return res.status(500).json({
            success: true,
            message: error.message,
        });
    }
}

//get average rating
const getAvgRating = async (req, res) => {
    try {
        //get course id
        const courseId = req.body.courseId;
        //calculate avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                }
            }
        ]);
        //return res
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Average rating fetched successfully",
                averageRating: result[0].averageRating,
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "No ratings yet for this course",
                averageRating: 0,
            });
        }



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//get all rating

const getAllRatings = async (req, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
<<<<<<< HEAD
            .sort({ rating: desc })
=======
            .sort({ rating: -1 })
>>>>>>> 89c774f (Initial backend upload)
            .populate({
                path: "course",
                select: "courseName"
            })
            .populate({
                path: "user",
                select: "firstName lastName email image"
            })
            .exec();

            return res.status(200).json({
                success: true,
                message: "All Reviews fetched successfully",
                data: allReviews,
<<<<<<< HEAD
            });

    } catch (error) {
        return res.status(500).json({
                success: false,
                message: error.message,
=======
            }); 

    } catch (error) { 
        return res.status(500).json({
                success: false,
                message: error.message,

>>>>>>> 89c774f (Initial backend upload)
            });
    }
}

export { createRating , getAvgRating , getAllRatings };