// import {v2 as cloudinary} from "cloudinary"
// // Helper function to upload a file to Cloudinary
// const uploadImageToCloudinary = async (file, folder, height, quality) => { 
//     // Create an options object that will be sent to Cloudinary
//     // 'folder' tells Cloudinary where to store your file
//     const options = { folder };

//     // If height is provided, add it to options
//     // This lets Cloudinary resize the image to the given height
//     if (height) {
//         options.height = height;
//     }

//     // If quality is provided, add it to options
//     // Quality reduces image size (e.g., 80, 50, 20)
//     if (quality) {
//         options.quality = quality;
//     }

//     // Allow Cloudinary to automatically detect file type
//     // Useful because Cloudinary can upload images, videos, pdfs, etc.
//     options.resource_type = 'auto';

//     // Upload the file to Cloudinary
//     // file.tempFilePath = temporary file path created by express-fileupload
//     // 'options' includes folder, height, quality, resource_type
//     return await cloudinary.uploader.upload(file.tempFilePath, options);
// };

// export default uploadImageToCloudinary;


import path from 'path';
// import { fileURLToPath } from 'url';
import {v2 as cloudinary} from "cloudinary"
// import fileUpload from 'express-fileupload';
const uploadImageToCloudinary = async (file, folder) => {
    try {
        console.log(file)
        const supportedType = [".jpg" ,".jpeg", ".png",".mp4"];
        // const fileType = file.name.split(".")[1].toLowerCase(); // this can lead to incorrect extension if file contains multiple dots file.name.jpeg
        const fileType = path.extname(file.name).toLowerCase();

        console.log("filetype:",fileType)

        const filext = supportedType.includes(fileType)

        console.log(filext)
        if(!filext){
                console.log("File type not supported.")
        }
         const resp= await cloudinary.uploader.upload(file.tempFilePath,{
            folder, resource_type:"auto"
        })
         console.log("resp", resp)
         return resp
        

    } catch (error) {
        console.error("Error Uploading File.",error)

    }
}
export default uploadImageToCloudinary;