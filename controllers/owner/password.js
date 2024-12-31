const Owner = require("../../models/owner_model");
const sendResetPasswordEmail = require("../../services/resetPasswordEmail");



const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if owner exists
    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(404).json({ message: "Owner not found." });
    }

    // Generate reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    owner.resetPasswordCode = resetCode;
    owner.resetPasswordCodeExpiry = Date.now() + 15 * 60 * 1000; 
    await owner.save();

    // Send email
    await sendResetPasswordEmail(email,"Dear Owner",resetCode);

    return res.status(200).json({ message: "Reset password code sent successfully." });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};


const resetPassword = async (req, res) => {
    try {
      const { email, resetCode, newPassword } = req.body;
  
      if (!email || !resetCode || !newPassword) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      // Find owner
      const owner = await Owner.findOne({ email, resetPasswordCode: resetCode });
  
      if (!owner || owner.resetPasswordCodeExpiry < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired reset code." });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update password and clear reset code
      owner.password = hashedPassword;
      owner.resetPasswordCode = undefined;
      owner.resetPasswordCodeExpiry = undefined;
      await owner.save();
  
      return res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
      console.error("Error resetting password:", error);
      return res.status(500).json({ message: "Server error. Please try again later." });
    }
};
  

module.exports = {requestPasswordReset,resetPassword};

