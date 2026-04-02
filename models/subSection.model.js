import mongoose from "mongoose";

const subSectionSchema = new mongoose.Schema({
    title:{
        type:String
    },
    timeDuration:{
        type:String
    },
    description:{
        type:String
    },
<<<<<<< HEAD
    videoUrl:{
=======
    videoURL:{
>>>>>>> 89c774f (Initial backend upload)
        type:String,
        
    },

});

export const SubSection = mongoose.model("SubSection", subSectionSchema);