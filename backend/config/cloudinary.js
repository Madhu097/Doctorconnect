import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  const cloudName = process.env.CLOUDINARY_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_SECRET_KEY;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      `Missing Cloudinary environment variables: ${
        !cloudName ? "CLOUDINARY_NAME " : ""
      }${!apiKey ? "CLOUDINARY_API_KEY " : ""}${
        !apiSecret ? "CLOUDINARY_SECRET_KEY" : ""
      }`,
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  console.log("Cloudinary configuration loaded.");
  console.log("Cloud name present:", Boolean(cloudName));
  console.log("API key present:", Boolean(apiKey));
  console.log("API secret present:", Boolean(apiSecret));

  // Verify API credentials without printing secrets.
  try {
    await cloudinary.api.ping();
    console.log("Cloudinary API authentication successful.");
  } catch (error) {
    console.error("Cloudinary API authentication failed:", error.message);
    throw error;
  }
};

export default connectCloudinary;
