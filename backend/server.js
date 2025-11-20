// require("dotenv").config();
import { config } from "dotenv";

import express from "express";
import cors from "cors";
import path from "path";
// const express = require("express");
// const cors = require("cors");
// const path = require("path");

// const authRoutes = require("./routes/authRoutes.ts");
// const reportRoutes = require("./routes/reportRoutes.ts");
// const taskRoutes = require("./routes/taskRoutes.ts");
// const userRoutes = require("./routes/userRoutes.ts");
// const connectToDB = require("./config/db.ts");

import connectToDB from "./config/db.ts";
const app = express();
config();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

connectToDB();

// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/task", taskRoutes);
// app.use("/api/report", reportRoutes);

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
