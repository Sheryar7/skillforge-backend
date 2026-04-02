import mongoose from "mongoose";

const courseProgress = new mongoose.Schema({
<<<<<<< HEAD
    courseID: {
=======
    courseId: {
>>>>>>> 89c774f (Initial backend upload)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    completedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubSection'
        }
    ]


});

export const CourseProgress = mongoose.model("CourseProgress", courseProgress);