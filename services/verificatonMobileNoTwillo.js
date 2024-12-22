const twilio = require("twilio");

// Initialize Twilio Client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Sends an OTP to the specified phone number using Twilio.
 * @param {string} phoneNumber - The recipient's phone number in E.164 format.
 * @param {string} otp - The OTP to be sent.
 * @returns {Promise<void>} - Resolves if the message is sent successfully.
 * @throws {Error} - Throws an error if Twilio fails to send the message.
 */
const sendOTP = async (phoneNumber, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your verification code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(`OTP sent successfully to ${phoneNumber}: SID ${message.sid}`);
  } catch (error) {
    console.error(`Failed to send OTP to ${phoneNumber}:`, error);
    throw new Error("Failed to send OTP. Please try again later.");
  }
};

module.exports = { sendOTP };
