const nodemailer = require("nodemailer")

// Create a transporter using your email service configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // or any other email service you use
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

async function sendResetPasswordEmail(email, username, resetCode) {
  try {
    const emailContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      color: #333333;
    }
    .content {
      padding: 20px;
      border-top: 2px solid #eeeeee;
      border-bottom: 2px solid #eeeeee;
      margin-bottom: 20px;
    }
    .content p {
      margin: 10px 0;
      color: black;
    }
    .name {
      font-size : 1.5em;
    }
    .footer {
      text-align: center;
      font-weight: bold;
      color: black;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reset password code for Parlour Wallah💇</h1>
    </div>
    <div class="content">
      <p class = "name">Hello ${username},</p>
      <p>Our Team are grateful to help you. Please use the following reset password code to complete your reset password:</p>
      <h2>${resetCode}</h2>
      <p>If you did not request this code, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>This email was sent by Parlour Wallah.</p>
    </div>
  </div>
</body>
</html>
`;
    // Send the email using Nodemailer
    await transporter.sendMail({
      from: "beinggdeveloper@gmail.com", // Your email address
      to: email,
      subject: "Parlour Wallah Reset Password Code",
      html: emailContent,
    });

    return { success: true, message: "Reset password email sent successfully." };
  } catch (emailError) {
    console.error("Error sending reset password email:", emailError);
    return { success: false, message: "Failed to sent reset password email." };
  }
}


module.exports = {sendResetPasswordEmail}