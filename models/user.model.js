import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        require:true,
        trim:true
    },

    lastName: {
        type:String,
        require:true,
        trim:true
    },

    email: {
        type:String,
        require:true,
        trim:true
    },
    
    password: {
        type:String,
        require:true,
        
    },

    accountType: {
        type:String,
        require:true,
        enum:['Admin','Instructor','Student']
    },

    additionalDetails: {
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'Profile'
    },

    courses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Course'
        }
    ],

    image:{
        type:String,
        require:true
    },

    courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CourseProgress',
    }],
    token:{ // for reset password
            type: String
        },
        resetPasswordExpire: {
            type:Date,
        }
    },{timestamps: true}
 );

export const User = mongoose.model("User", userSchema);