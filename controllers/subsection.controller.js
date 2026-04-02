import { Course } from "../models/course.model.js";
import { Section } from "../models/section.model.js";
import { SubSection } from "../models/subSection.model.js";
import uploadImageToCloudinary from '../utils/imageUploader.js';

const createSubSec = async (req, res) => {
    try {
        // console.log(req.files)
        const { title, description, timeDuration, sectionId } = req.body;
        const video = req.files.video;
        // console.log("video here", video);
        if (!title || !timeDuration || !description || !video || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            })
        }

        const sectionExists = await Section.findById(sectionId);
        if (!sectionExists) {
            return res.status(404).json({
                success: false,
                message: "Section not found with given ID",
            });
        }


        // console.log("Uploading video...");
        //upload vedio
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER)
        console.log("video: ", uploadDetails.secure_url)
        //create section
        const subSection = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoURL: uploadDetails.secure_url
        });
        // console.log("subSection ", subSection);



        const section = await Section.findByIdAndUpdate(
            sectionId,
            { $push: { subSection: subSection._id } },
            { new: true }
        ).populate("subSection");



        console.log("Received sectionId:", sectionId);


        // console.log("Section ", section);
        res.status(200).json({
            success: true,
            message: "SubSection created successfully.",
            section
        })
    } catch (error) {
        console.log("Create SubSection Error:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong while creating section.",
            error: error.message,
        });
    }
}

const updateSubSec = async (req, res) => {
    try {
        const { title, description, timeDuration, subSectionId } = req.body;
        const vedio = req.files?.video;
        console.log(timeDuration, title, description, subSectionId, vedio)

        //at least one field is provided
        if (!title && !timeDuration && !description && !video) {
            return res.status(400).json({
                success: false,
                message: "At least one field (title, description, timeDuration, or video) must be provided.",
            });
        }
        let uploadDetails;
        if (vedio) {
            uploadDetails = await uploadImageToCloudinary(vedio, process.env.FOLDER)
            console.log("vedio ", uploadDetails.secure_url)

        }
        //update subsection
        const subsection = await SubSection.findByIdAndUpdate({ _id: subSectionId },
            { title, description, timeDuration, videoURL: uploadDetails?.secure_url },
            { new: true })
        res.status(200).json({
            success: true,
            message: "SubSection updated successfully.",
            subsection
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Something went wrong while updating sunSection.",
            error: error
        })
    }
}

const deleteSubSec = async (req, res) => {
    try {
        const { subSectionId, courseId } = req.body;

        //delete subsec
        await SubSection.findByIdAndDelete(subSectionId)

        //pull out subsec from section schema
        await Section.updateOne({ subSection: subSectionId }, { $pull: { subSection: subSectionId } }, { new: true })
        const course = await Course.findById(courseId)
            .populate({ path: "courseContent", populate: { path: "subSection" } })
            .exec();

        console.log("course ", course)
        res.status(200).json({
            success: true,
            message: "Sub Section deleted successfully.",
            course
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the Subsection.",
            error: error
        })
    }
}

export { createSubSec, updateSubSec, deleteSubSec };

