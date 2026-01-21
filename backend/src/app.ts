import express, { Request, Response } from "express";
import { config } from "dotenv";
import cors from "cors";
import path from "path";

import connectToDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";

import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

import organisationRouter from "./routes/organisationRoute.js";
import formRouter from "./routes/formRoutes.js";

import { protect } from "./middlewares/authMiddleware.js";
import ticketRouter from "./routes/ticketRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import userRouter from "./routes/userRoute.js";
import statRouter from "./routes/statRoutes.js";
import attachementRouter from "./routes/attachement.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
config();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

connectToDB();



//await (tickets.forEach(async(t)=>await ticketModel.create(t)))

// app.set("etag", false);
app.use("/api/auth", authRouter);
app.use("/api/organisations",protect, organisationRouter);
app.use("/api/forms",protect, formRouter);
app.use("/api/tickets",protect, ticketRouter);
app.use("/api/comments",protect, commentRouter);
app.use("/api/users",protect, userRouter);
app.use("/api/stat",protect,statRouter)
app.use("/api/attachement",protect,attachementRouter)
app.get("/api/test",(req:Request,res:Response)=>{
  console.log("test")
  return res.status(200).json({message:"test"});
})

app.use(
  "/uploads",
  express.static(path.join(path.dirname(__dirname), "uploads"))
);

// Sanitize PORT: remove any non-digit characters and parse to integer
const rawPort = String(process.env.PORT ?? "").trim();
const numericPort = parseInt(rawPort.replace(/[^0-9]/g, ""), 10);
const PORT =
  Number.isFinite(numericPort) && numericPort > 0 ? numericPort : 3500;

  
app.listen(PORT, (err?: Error) => {
  if (err) console.error("Server failed to start:", err);
  console.log(`Server running on port ${PORT}`);
});
