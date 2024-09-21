import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";

// Middleware to verify JWT token
const jwtVerify = asyncHandler(async (req, _, next) => {
    const authHeader =  req.header("Authorization");
    const token = req.cookies.AccessToken || authHeader.trim().replace(/^Bearer\s+/, '');
   

    if (!token) {
        throw new ApiError(401, "Authentication token is invalid");
    }

    try {
        // console.log(token);
        const decodedToken = jwt.verify(token,process.env.JWT_ACCESSTOKEN_SECERT);
        console.log("decoded token :",decodedToken);

        const user = await User.findById(decodedToken._id).select("-password -AccessToken");
        if (!user) {
            throw new ApiError(401, "User not found");
        }

        req.user = user;
        next();
    } catch (err) {
        throw new ApiError(401, "Invalid or expired token");
    }
});

export default jwtVerify;
