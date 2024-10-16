import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/userModel.js";
import Jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";

const createAccessAndRefreshToken = async (userId) => {
  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // Generate access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Assign refresh token to user and save
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Return the generated tokens
    return { accessToken, refreshToken };
  } catch (error) {
    // Throw an error if there's an issue generating tokens
    throw new ApiError(
      500,
      "Something went wrong, Error creating access and refresh token"
    );
  }
};

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email already exists");
  }
  const user = await User.create({ name, email, password });
  if (!user) {
    throw new ApiError(500, "Something went wrong, Error creating user");
  }
  const { accessToken, refreshToken } = await createAccessAndRefreshToken(
    user._id
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(201)
    .cookie("accessToken", accessToken, options) // cookies are two way that can be useed with req and res both
    .cookie("refreshToken", refreshToken, options) // cookies are two way that can be useed with req and res both
    .json({
      success: true,
      message: "User created successfully",
      user: { _id: user._id, name: user.name, email: user.email },
    });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "email is reqiuired");
  }
  const user = await User.findOne({ email }); // means find a user with either email or username);

  if (!user) {
    throw new ApiError(404, "User does not exist : Can't login");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(
      404,
      "Password does not match with your old password : Try again"
    );
  }
  const { accessToken, refreshToken } = await createAccessAndRefreshToken(
    user._id
  );

  const options = {
    // since by default cookies can be mmodified by anyone from frint-end or server so by doing this sookies can only be modified from server side
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options) // cookies are two way that can be useed with req and res both
    .cookie("refreshToken", refreshToken, options) // cookies are two way that can be useed with req and res both
    .json({
      success: true,
      refreshToken,
    });
});

const becomeAdmin = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!isValidObjectId(userId)) {
    throw new ApiError(401, "Not authorized to perform this action");
  }
  const adminKey = req.body;
  if (adminKey !== process.env.ADMIN_KEY) {
    throw new ApiError(401, "Not authorized to perform this action");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role: "admin" },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.json({
    success: true,
    message: "User has been made admin",
    name: user.name,
    email: user.email,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, //this remove field from databse
      },
    },
    {
      new: true, // to get updated new value with a refresh token as undefined otherqise we will get same value of refresh token
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json({ success: true, message: "User Logged Out" });
});

const refreshAccessTooken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unathorized Access");
  }

  const decodedToken = Jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(401, "Invalid refreshToken");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or used, login again");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  const { accessToken, newRefreshToken } = await createAccessAndRefreshToken(
    user._id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json({
      success: true,
      name: user.name,
      refreshToken: newRefreshToken,
    });
});

export { signup, loginUser, becomeAdmin, logoutUser, refreshAccessTooken };
