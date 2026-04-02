import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String
    },
    courseDescription: {
        type: String
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    whatYouWillLearn: {
        type: String
    },
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section'
        }
    ],
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RatingAndReview'
        }
    ],
    price: {
        type: Number
    },
    thumbnail: {
        type: String
    },
    tag: {
        type: [String]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        // require: true,
        ref: 'Category'
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        }
    ],
    status: {
        type: String,
        enum: ['Draft', 'Published'],
        default: 'Draft'
    }
},
    { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);

