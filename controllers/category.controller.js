<<<<<<< HEAD
import {Category} from "../models/category.model.js"
import { Course } from "../models/course.model.js";
 
=======
import { Category } from "../models/category.model.js"
import { Course } from "../models/course.model.js";

>>>>>>> 89c774f (Initial backend upload)
const createCategory = async (req, res) => {
    try {
        //fetch data
        const { name, description } = req.body;
        //validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All Fields required!',
            });
        }
        //create entry in DB
        const category = await Category.create({
            name: name,
            description: description,
        });
        console.log('Category Details: ', category);
        //Return response
        return res.status(200).json({
            success: true,
            message: 'Category Created Successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
<<<<<<< HEAD
 
const showAllCategories = async (req, res) => {
    try {
        const allCattgory = await Category.find({}, { name: true, description: true });
        console.log("All Category: ",allCattgory);
=======

const showAllCategories = async (req, res) => {
    try {
        const allCategory = await Category.find({}, { name: true, description: true });
        console.log("All Category: ", allCategory);
>>>>>>> 89c774f (Initial backend upload)

        return res.status(200).json({
            success: true,
            message: 'All Categories return Successfully.',
<<<<<<< HEAD
            allCattgory
=======
            data: allCategory

>>>>>>> 89c774f (Initial backend upload)
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
<<<<<<< HEAD
 
=======

>>>>>>> 89c774f (Initial backend upload)
const categoryPageDetails = async (req, res) => {
    try {
        //get category
        const { categoryId } = req.body;
        //get courses of specified category
        const selectedCategory = await Category.findById(categoryId)
            .populate('courses')
            .exec();
        //validation
        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Data Not Found!',
            });
        }
        //get courses of different category
        const differentCategories = await Category.find({
            _id: { $ne: categoryId },
        }).populate('courses').exec();

        //get top selling courses
        //HW:write it on your own
<<<<<<< HEAD
        const allCategory= await Category.find()
                                        .populate({
                                            path:"courses",
                                            match:{status: "published"},
                                            populate:{
                                                path:"instructor",
                                                populate:"additionalDetails"
                                            }
                                        }) .exec();

            const allCourses = allCategory.flatMap((category) => category.courses);
            console.log("allCourses", allCourses)
            const mostSellingCourse = allCourses.sort((a,b) => b.sold - a.sold).slice(0,10)
=======
        const allCategory = await Category.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: {
                    path: "instructor",
                    populate: "additionalDetails"
                }
            }).exec();

        const allCourses = allCategory.flatMap((category) => category.courses);
        console.log("allCourses", allCourses)
        const mostSellingCourse = allCourses.sort((a, b) => b.sold - a.sold).slice(0, 10)
>>>>>>> 89c774f (Initial backend upload)

        //return res
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategories
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

<<<<<<< HEAD
export {createCategory , showAllCategories , categoryPageDetails};
=======
export { createCategory, showAllCategories, categoryPageDetails };
>>>>>>> 89c774f (Initial backend upload)
