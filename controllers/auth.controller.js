import { User } from "../models/user.model.js";
import { OTP } from "../models/otp.model.js";
import otpGenerator from "otp-generator";
import { Profile } from "../models/profile.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { encrypt, decrypt } from "../utils/cipher.js";
import speakeasy from "speakeasy";
import mailSender from "../utils/mailSender.js";

// send otp
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }


    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Save OTP in DB
    await OTP.create({
      email,
      otp: hashedOtp,
    });

    // Send email
    await mailSender(
      email,
      "Verification Email - SkillForge",
      `<h2>Your OTP is: ${otp}</h2>`
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Error while sending OTP",
      error: error.message,
    });
  }
};


//signup 
const signUp = async (req, res) => {
  // console.log("Signup Body:", req.body);
  try { 
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      contactNumber,
      accountType,
      otp,
    } = req.body;

    // Validate fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Get latest OTP
    const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 });

    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    // Check OTP expiry (5 minutes)
    const otpAge = Date.now() - new Date(recentOtp.createdAt).getTime();
    const FIVE_MINUTES = 5 * 60 * 1000;

    if (otpAge > FIVE_MINUTES) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // Compare OTP
    const isValid = await bcrypt.compare(otp, recentOtp.otp);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create profile
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    // Create user
    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contactNumber,
      accountType,
      additionalDetails: profileDetails._id,
    });

    // Delete OTP after success
    await OTP.deleteMany({ email });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User cannot be registered",
      error: error.message,
    });
  }
};

//login
const login = async (req, res) => {
  try {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({ email: normalizedEmail }).populate(
      "additionalDetails"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not registered",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Create ACCESS TOKEN (short life)
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        accountType: user.accountType,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Create REFRESH TOKEN (long life)
    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Remove password before sending user
    user.password = undefined;

    // Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user,
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
}

const refreshToken = async (req, res) => {
   try {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Create NEW access token
    const newAccessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        accountType: user.accountType,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Send new access token
    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });

  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

// change password
const changePassword = async (req, res) => {
  try {
    // Get user id from auth middleware (JWT)
    const userId = req.user.id;

    // Get data from request body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Validate inputs
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check new password match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password and Confirm Password do not match",
      });
    }

    // Find user in DB
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify old password
    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    user.password = hashedNewPassword;
    await user.save();

    // Send success response
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while changing password",
    });
  }
};

export { sendOTP, signUp, login, changePassword, refreshToken };
