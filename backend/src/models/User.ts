import mongoose from "mongoose";
// const mongoose = require("mongoose");
const RefreshTokenSchema = new mongoose.Schema({
  token: String, // hashed token
  createdAt: { type: Date, default: Date.now },
  ip: String, // optional: track ip/browser for revocation
});
const OrganisationSchema=new mongoose.Schema({
  name:{type:String, required:true},
  head:{type:String, required:false},
  description:{type:String, required:false},
})
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    organisation:{type:OrganisationSchema, required:true},
    organisationsList:[OrganisationSchema],
    role: { type: String, enum: ["admin", "standard","supervisor"], default: "standard" },
    refreshTokens: [RefreshTokenSchema],
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);
export default userModel;
