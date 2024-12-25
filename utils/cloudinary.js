const cloudinary = require('cloudinary').v2;

// Load environment variables
require('dotenv').config();

const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload a file
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
        throw new Error("Please provide a valid file path");
    }

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      timeout: 60000
    });

    //file has been uploaded successfully
    console.log("File uploaded successfully", result);

    return result;
  } catch (error) {
    fs.unlinkSync(localFilePath); // if image has some error then delete the image(this image may be corrupted)
    console.log("Error while uploading image, file", error);
    return null;
  }
};



module.exports = uploadOnCloudinary;
