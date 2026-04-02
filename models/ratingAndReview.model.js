import mongoose from "mongoose";

const ratingAndReviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'User'
    },
    rating:{
        type:Number,
        require:true
    },
    review:{
        type:String,
        require:true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'Course',
        index:true
    }
    
});

export const RatingAndReview = mongoose.model("RatingAndReview", ratingAndReviewSchema);