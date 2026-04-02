import { User } from "../models/user.model.js";
import mailSender from "../utils/mailSender.js";
import bcrypt from "bcryptjs";
 
const resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body; 
    // console.log("Email from request:", email);
    
    // Check if user exists
    const user = await User.findOne({ email });
    // console.log("User email:", user?.email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User is not registered!',
      });
    } 
    // Generate unique reset token
    const token = crypto.randomUUID(); 
    // Set token and expiration (5 minutes)
    user.token = token;
    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000;
    await user.save(); // Save updated user 
    // Create password reset URL
    const url = `http://localhost:3000/update-password/${token}`; 
    // Send reset email
    await mailSender({
      email: user.email,
      subject: 'Password Reset Link',
      body: `
        <h2>Hello ${user.name || 'User'} 👋</h2>
        <p>Click the link below to reset your password. The link expires in 5 minutes.</p>
        <p><a href="${url}" target="_blank">${url}</a></p>
        <p>If you did not request a password reset, please ignore this email.</p>
      `,
    }); 
    // Respond to client
    return res.status(200).json({
      success: true,
      message: 'Reset password email sent. Please check your inbox.',
    });

  } catch (error) {
    console.error('Error in resetPasswordToken:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while sending reset password email!',
    });
  }
};
 
const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body; 
    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match!',
      });
    } 
    // Find user by token
    // console.log("Token from request body:", token);
    const user = await User.findOne({ token }); 
    // console.log("User found with token:", user); 
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token!',
      });
    } 
    // Check token expiration
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Token has expired. Please request a new password reset.',
      });
    } 
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10); 
    // Update password and clear token fields
    user.password = hashedPassword;
    user.token = undefined; // clear token
    user.resetPasswordExpires = undefined; // clear expiration
    await user.save(); 
    // Respond success
    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully!',
    });

  } catch (error) {
    console.error('Error in resetPassword:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while resetting password!',
    });
  }
};

export {resetPassword , resetPasswordToken};