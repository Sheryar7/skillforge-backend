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
<<<<<<< HEAD
        type: [String] 
=======
        type: [String]
>>>>>>> 89c774f (Initial backend upload)
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
<<<<<<< HEAD
    ], 
    status:{
        type: [String],
        enum: ['Draft','Published']
    }
});

export const Course = mongoose.model("Course" , courseSchema);
=======
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

>>>>>>> 89c774f (Initial backend upload)
