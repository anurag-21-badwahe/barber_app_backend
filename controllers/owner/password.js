const Owner = require("../../models/owner_model");
const {sendResetPasswordEmail} = require("../../services/resetPasswordEmail");
const bcrypt = require("bcrypt");
const z = require("zod");

// ✅ Validator for both email and phone number formats
const requestPasswordResetValidator = z.object({
    login: z.string().refine(
        (value) =>
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ||
            /^[0-9]{10}$/.test(value),
        { message: "Invalid email or phone number format." }
    ),
});

// ✅ Helper functions
const generateResetCode = () => Math.floor(100000 + Math.random() * 900000).toString();
const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

const requestPasswordReset = async (req, res) => {
    try {
        // Validate input using Zod
        const { login } = requestPasswordResetValidator.parse(req.body);

        // Check if the owner exists using email or phone number
        const owner = await Owner.findOne({
            $or: [{ email: login }, { phoneNo: login }],
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found." });
        }

        // Generate a reset code and expiry
        const resetCode = generateResetCode();
        owner.resetPasswordCode = resetCode;
        owner.resetPasswordCodeExpiry = Date.now() + 15 * 60 * 1000; // Expires in 15 mins
        await owner.save();

        // Send reset code via Email or SMS
        if (isValidEmail(login)) {
            await sendResetPasswordEmail(owner.email, "Dear Owner", resetCode);
        } else if (isValidPhone(login)) {
            console.log(`Sending SMS to ${owner.phoneNo} with code: ${resetCode}`);
            // Implement actual SMS sending logic here
        }

        return res.status(200).json({ message: "Reset password code sent successfully." });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error("Error requesting password reset:", error);
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
};

const resetPassword = async (req, res) => {
    try {
        // Input validation schema
        const resetPasswordValidator = z.object({
            login: z.string().nonempty({ message: "Login is required." }),
            resetCode: z.string().nonempty({ message: "Reset code is required." }),
            newPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
        });

        // Validate input using Zod
        const { login, resetCode, newPassword } = resetPasswordValidator.parse(req.body);

        // Find the owner by email or phone number and verify reset code
        const owner = await Owner.findOne({
            $or: [{ email: login }, { phoneNo: login }],
            resetPasswordCode: resetCode,
        });

        if (!owner || owner.resetPasswordCodeExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired reset code." });
        }

        // Hash the new password using bcrypt
        const salt = await bcrypt.genSalt(10);
        owner.password = await bcrypt.hash(newPassword, salt);

        // Clear reset code and expiry
        owner.resetPasswordCode = undefined;
        owner.resetPasswordCodeExpiry = undefined;
        await owner.save();

        return res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error("Error resetting password:", error);
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
};

module.exports = { requestPasswordReset, resetPassword };
