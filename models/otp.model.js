<<<<<<< HEAD
// import mongoose from "mongoose";
// import mailSender from '../utils/mailSender.js';

// const OTPSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         require: true

//     },
//     otp: {
//         type: String,
//         require: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now(),
//         expires: 5 * 60
//     }
// });

// //a ftn to send emails

// async function sendVerificationEmail(email, otp) {
//     try {
//         const mailResponse = await mailSender(email, 'Verification Email from SherryBernabéuCode', otp);
//         console.log('Email sent Successfully', mailResponse);

//     } catch (error) {
//         console.log('Error occured while sendin mails', error);
//         throw error;
//     }

// }

// OTPSchema.pre('save', async function (next) {
//     await sendVerificationEmail(this.email, this.otp);
//     next();
// });

// export const OTP = mongoose.model("OTP", OTPSchema);

import mongoose from "mongoose";
=======
 import mongoose from "mongoose";
>>>>>>> 89c774f (Initial backend upload)
import mailSender from "../utils/mailSender.js";

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
<<<<<<< HEAD
=======
     
>>>>>>> 89c774f (Initial backend upload)
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60,
    },
});

// async function sendVerificationEmail(email, otp) {
//     await mailSender({
//         email: this.email,
//         subject: "Verification Email",
//         body: `<h2>Your OTP is ${this.otp}</h2>`
//     }
//     );
// }

// OTPSchema.pre("save", async function (next) {
//     try {
//         await sendVerificationEmail(this.email, this.otp);
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

export const OTP = mongoose.model("OTP", OTPSchema);
