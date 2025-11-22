import mongoose, { Schema } from "mongoose";
// const mongoose = require("mongoose");
const RefreshTokenSchema = new mongoose.Schema({
  token: String, // hashed token
  createdAt: { type: Date, default: Date.now },
  ip: String, // optional: track ip/browser for revocation
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    organisation:{type:Schema.Types.ObjectId,ref:"Organisation" , required:true},
    organisationsList:[{type:Schema.Types.ObjectId,ref:"Organisation"}],
    role: { type: String, enum: ["admin", "standard","supervisor"], default: "standard" },
    refreshTokens: [RefreshTokenSchema],
    activeStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
