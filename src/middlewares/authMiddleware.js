import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import User  from "../models/userModel.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
  //Access token from cookies if  available
  //In case of mobile users, tokens are sent in headers, replace("Bearer ", "") Bearer and a single space wiht empty string bcz from client side, Authorization: Bearer <token> ,token is accesstoken

  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("token from cookies auth middle");
      throw new ApiError(401, "Unathorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid  access token");
    }

    req.user = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

const isAdmin = asyncHandler(async (req, _, next) => {
  if (req.user.role !== "admin" ) {
    throw new ApiError(
      403,
      "Access denied, only admin can access this resource"
    );
  }
  next();
});

export { verifyJWT, isAdmin };
