import jwt from "jsonwebtoken";

// admin authentication middlware
const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
    if (
      typeof token_decode !== "object" ||
      token_decode.role !== "admin" ||
      token_decode.email !== process.env.ADMIN_EMAIL?.trim().toLowerCase()
    ) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Not Authorized Login Again" });
  }
};

export default authAdmin;
