import {CourseProgress} from "../models/courseProgress.model.js";

const updateCrourseProgress = async (req, res) => {
  try {
    const { courseId, subSectionId } = req.body;
    const { userId } = req.user;
    // console.log(userId, courseId);
    if (!courseId || !subSectionId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Course ID and Subsection ID are required",
        });
    }
    const courseProgress = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });

    //check if course progress exists
    if (!courseProgress) {
      return res.status(404).json({ message: "Course progress not found" });
    } else {
<<<<<<< HEAD
      const completedVedios = courseProgress.completedVedios;

      //check if vedio is already marked as completed
      if (completedVedios.includes(subSectionId)) {
=======
      const completedVideos = courseProgress.completedVideos;

      //check if vedio is already marked as completed
      if (completedVideos.includes(subSectionId)) {
>>>>>>> 89c774f (Initial backend upload)
        return res
          .status(400)
          .json({
            success: false,
            message: "Video already marked as completed",
          });
      } else {
<<<<<<< HEAD
        courseProgress.completedVedios.push(subSectionId);
=======
        courseProgress.completedVideos.push(subSectionId);
>>>>>>> 89c774f (Initial backend upload)
        await courseProgress.save();
        return res
          .status(200)
          .json({ success: true, message: "Video marked as completed" });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getCourseProgess = async (req, res) => {
  try {
    const { courses } = req.body;
<<<<<<< HEAD
    const userId = req.user.userId;
=======
    const userId = req.user.id;
>>>>>>> 89c774f (Initial backend upload)
    console.log("courses ", courses);
    console.log("userId ", userId);
    const progress = await CourseProgress.find({
      userId: userId,
      courseId: { $in: courses },
    })
      .populate({ path: "courseId" ,populate: { path: "courseContent" , populate: { path: "subSection" }}})
<<<<<<< HEAD
      .populate("completedVedios")
=======
      .populate("completedVideos")
>>>>>>> 89c774f (Initial backend upload)
      .exec();
    console.log("progress", progress);
    if (progress.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Course progress not found" });
    } 

    let progressArray=[];
     progress.forEach((course)=>{
        let subsecLength=0 
        course.courseId.courseContent.forEach((section) => {
            subsecLength += section.subSection.length
        })

<<<<<<< HEAD
       const completedVediosLength = course.completedVideos.length
       const courseProgress = Math.floor((completedVediosLength / subsecLength) * 100)
=======
       const completedVideosLength = course.completedVideos.length
       const courseProgress = Math.floor((completedVideosLength / subsecLength) * 100)
>>>>>>> 89c774f (Initial backend upload)

        let courseLength={ id:course.courseId._id, progress:courseProgress }
        progressArray.push(courseLength)
     })
     console.log(progressArray)


      return res.status(200).json({ success: true, progress:progressArray });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server Error",
      error: error.message,
    });
  }
};

export { updateCrourseProgress, getCourseProgess };