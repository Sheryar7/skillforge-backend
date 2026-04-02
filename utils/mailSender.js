<<<<<<< HEAD
// import nodemailer from "nodemailer";


// const mailSender = (email, title, body) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             host: process.env.MAIL_HOST,
//             auth: {
//                 user: process.env.MAIL_USER,
//                 pass: process.env.MAIL_PASS,
//             },
//         });

//         const info = transporter.sendMail({
//             from: `"SkillForge Learning Management System Backend" <${process.env.MAIL_USER}>`,
//             to: `${email}`,
//             subject: `${title}`,
//             html: `Verify your account using the OTP: ${body}`
//         });

//         return info;
//     } catch (error) {
//         console.log("Error while Mailing:", error);
//         throw error;
//     }
// };

// export default mailSender;

import nodemailer from "nodemailer";

const mailSender = (email,title, body) => {
    try {
        console.log(body)
        const transprter = nodemailer.createTransport({
=======
import nodemailer from "nodemailer"
const mailSender = async (email,title, body) => {
    try {
        console.log(body)
        const transporter = nodemailer.createTransport({
>>>>>>> 89c774f (Initial backend upload)
            host:process.env.HOST_MAIL,
            auth: {
                user:process.env.HOST_USER,
                pass:process.env.HOST_PASS
            }
        });

<<<<<<< HEAD
            const info = transprter.sendMail({
=======
            const info = await transporter.sendMail({
>>>>>>> 89c774f (Initial backend upload)
                from: process.env.HOST_USER,
                to: `${email}`,
                subject:`${title}`,
                html:`Verify your account using the OTP: ${body}`
            })
            // console.log("info ",info)
            return info;
    } catch (error) {
        console.log("Error while Mailing: ",error)
    }
}
<<<<<<< HEAD

export default mailSender;
=======
export default mailSender;
>>>>>>> 89c774f (Initial backend upload)
