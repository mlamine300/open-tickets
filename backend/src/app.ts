import express from "express";
import { config } from "dotenv";
import cors from "cors";
import path from "path";

import connectToDB from "./config/db.js";
import authRouter from "./routes/authRoutes.ts";

import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import organisationModel from "./models/Organisation.ts";
import { ObjectId } from "mongodb";
import userModel from "./models/User.ts";
import ticketModel from "./models/Ticket.ts";
import organisationRouter from "./routes/organisationRoute.ts";
import formRouter from "./routes/formRoutes.ts";
import formulaireModel from "./models/Formulaire.ts";
import { protect } from "./middlewares/authMiddleware.ts";
import ticketRouter from "./routes/ticketRoutes.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
config();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

connectToDB();
// await formulaireModel.deleteMany({});
/**
 * 
 * label:{type:String,required:true},
    name:{type:String,required:true},
    type: { type: String, enum: ["text", "number","select","date"], default: "text" },
    possibleValues:[{type:String}]
 */
// const form={name:"colis perdu",description:"declarer un colis perdu",fields:[
//   {name:"date", label:"date",type:"date"},
//    {name:"type",label:"type",type:"select",possibleValues:["livraison","retour","echange"]},
//  {name:"tracking", label:"tracking",type:"text"},
//   {name:"client",label:"client",type:"text"},
//   {name:"sac",label:"sac",type:"text",required:false},
//   {name:"depart",label:"depart",type:"text",required:false},

// ]};
// const form2={
// name:"demande de tarif",
// description:"demande de tarif pour un nouveau client",
// fields:[{
//   name:"wilaya",label:"wilaya",type:"select",possibleValues:["adrar","chlef","laghouat","alger","blida","oran"]
  
// },
// {name:"station",label:"station",type:"text"},
// {name:"volume",label:"volume par mois",type:"number"},
// {name:"nature",label:"nature de la marchandise",type:"text",required:false}
// ]}

// const form3={
//   name:"reclamation client",
//   description:"formulaire de reclamation client",
//   fields:[{
//     name:"type",label:"type de reclamation",type:"select",possibleValues:["colis endommagé","colis perdu","retard de livraison","autre"] },
    
//   ]
// }

// await formulaireModel.create(form);
// await formulaireModel.create(form2);
// await formulaireModel.create(form3);


app.use("/api/auth", authRouter);
app.use("/api/organisations",protect, organisationRouter);
app.use("/api/forms",protect, formRouter);
app.use("/api/tickets",protect, ticketRouter);



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
