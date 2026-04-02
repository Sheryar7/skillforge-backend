import { Section } from "../models/section.model.js";
import { Course } from "../models/course.model.js";
import { SubSection } from "../models/subSection.model.js";

const createSection = async (req, res) => {
    try {
        //data fetch
        const { sectionName, courseId } = req.body;
        //data validATION
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties!"
            });
        }
        //create section
        const newSection = await Section.create({ sectionName });
        //update course with sections objectId
        const course = await Course.findByIdAndUpdate({ _id: courseId }, { $push: { courseContent: newSection._id } }, { new: true }).populate("courseContent").exec()

        //return response
        res.status(200).json({
            success: true,
            message: 'Section Created Successfully.',
            course,
        });
    } catch (error) {
        console.error("CREATE SECTION ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create section, please try again!",
            error: error.message,
        });
    }
}

const updateSection = async (req, res) => {
    try {
        //fetch data
        const { sectionName, sectionId } = req.body;
        // console.log(sectionName, sectionId);
        //data validation
        if (!sectionName || !sectionId) {
            res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }
        //update section
        const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });
        //return res
        res.status(200).json({
            success: true,
            message: 'Section Updated Successfully.',
            section

        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to update section, please try again!', 

        });
    }
}

const deleteSection = async (req, res) => {
    try {
        const { sectionId, courseId } = req.body;

        console.log("Deleting Section ID:", sectionId, "from Course ID:", courseId);

        // Delete the section
        const section = await Section.findByIdAndDelete({ _id: sectionId });
        if (!section) {
            return res.status(404).json({ success: false, message: "Section not found!" });
        }

        // Remove the section reference from the course
        const course = await Course.findByIdAndUpdate(
            courseId,
            { $pull: { courseContent: sectionId } },
            { new: true } // Return updated document
        );

        console.log("Section removed from course");

        // Delete all subsections associated with this section
        if (section.subSection && section.subSection.length > 0) {
            await SubSection.deleteMany({ _id: { $in: section.subSection } });
            console.log("SubSections deleted");
        }

        // Get updated course with populated courseContent and subSections
        const updatedCourse = await Course.findById(courseId)
            .populate({ path: "courseContent", populate: { path: "subSection" } })
            .exec();

        // Return response
        res.status(200).json({
            success: true,
            course: updatedCourse,
            message: "Section deleted successfully!",
        });

    } catch (error) {
        console.error("Error while deleting section:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the section.",
            error: error.message
        });
    }
};

export { createSection, updateSection, deleteSection };