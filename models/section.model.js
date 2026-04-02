import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
    sectionName: {
        type: String
    },
    subSection: [
        {
            type: mongoose.Schema.Types.ObjectId,
            require:true,
            ref:'SubSection'
        }
    ]


});

export const Section = mongoose.model("Section", sectionSchema);