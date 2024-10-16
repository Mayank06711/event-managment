import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    refreshToken: { type: String, required: true}
  },
  { timestamps: true }
);

// Hash the password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hashSync(this.password, 10);
  next();
});

// Check password method
UserSchema.methods.isPasswordCorrect = async function (password) {
  // Compare the provided password with the hashed password stored in the current user document
  return await bcrypt.compare(this.password, password);
};

userSchema.methods.generateAccessToken = function () {
  // Generate a JSON Web Token (JWT) containing user information
  // Sign the token with the ACCESS_TOKEN_SECRET environment variable
  // Set the expiration time for the token based on the ACCESS_TOKEN_EXPIRY environment variable

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", UserSchema);

export default User;
