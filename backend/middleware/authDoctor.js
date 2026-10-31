import jwt from "jsonwebtoken";

// doctor authentication middlware
const authDoctor = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    const bearerToken = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : "";
    const dtoken = bearerToken || req.headers.dtoken;
    if (!dtoken) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
    if (
      typeof token_decode !== "object" ||
      token_decode.role !== "doctor" ||
      !token_decode.id
    ) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    req.docId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Not Authorized Login Again" });
  }
};

export default authDoctor;
