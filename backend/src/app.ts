import express from "express";
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
const tickets=[
  {
    creator: "69223464abc73498c7177744",
    ref: "TCK-001",
    emitterOrganizationId: "6922329a8ccb1dad8209739e",
    recipientOrganizationId: "6922329a8ccb1dad820973a1",
    associatedOrganizations: [],
    formName: "colis perdu",
    status: "open",
    priority: "low",
    pj: null,
    message: "Déclaration d’un colis perdu.",
    comments: [],
    specialFields: {
      date: "2025-01-20",
      type: "livraison",
      client: "Kamel",
      sac: "SAC-200",
      depart: "organisations"
    },
    AssignedTo: {
      name: "69223464abc73498c7177747",
      date: "2025-02-01"
    },
    AssignementHistory: [
      {
        name: "69223464abc73498c7177748",
        date: "2025-01-28"
      }
    ],
    updatedAt: new Date()
  },

  {
    creator: "69223464abc73498c7177747",
    ref: "TCK-002",
    emitterOrganizationId: "6922329a8ccb1dad820973a2",
    recipientOrganizationId: "6922329a8ccb1dad8209739e",
    associatedOrganizations: [],
    formName: "demande de tarif",
    status: "open",
    priority: "medium",
    pj: null,
    message: "Besoin d’un tarif pour un nouveau client.",
    comments: [],
    specialFields: {
      wilaya: "oran",
      station: "Station Oran",
      volume: 1400,
      nature: "Électronique"
    },
    AssignedTo: null,
    AssignementHistory: [],
    updatedAt: new Date()
  },

  {
    creator: "69223464abc73498c7177748",
    ref: "TCK-003",
    emitterOrganizationId: "6922329a8ccb1dad820973a3",
    recipientOrganizationId: "6922329a8ccb1dad820973a4",
    associatedOrganizations: [],
    formName: "reclamation client",
    status: "open",
    priority: "high",
    pj: "colis_endommage.png",
    message: "Réclamation pour colis endommagé.",
    comments: [],
    specialFields: {
      type: "colis endommagé"
    },
    AssignedTo: {
      name: "69223464abc73498c717774b",
      date: "2025-02-03"
    },
    AssignementHistory: [],
    updatedAt: new Date()
  },

  {
    creator: "69223464abc73498c7177749",
    ref: "TCK-004",
    emitterOrganizationId: "6922329a8ccb1dad820973a5",
    recipientOrganizationId: "6922329a8ccb1dad820973a0",
    associatedOrganizations: [],
    formName: "colis perdu",
    status: "open",
    priority: "low",
    pj: null,
    message: "Client signale colis non reçu.",
    comments: [],
    specialFields: {
      date: "2025-02-02",
      type: "retour",
      client: "Noureddine",
      sac: "SAC-110",
      depart: "organisations"
    },
    AssignedTo: null,
    AssignementHistory: [],
    updatedAt: new Date()
  },

  {
    creator: "69223464abc73498c717774a",
    ref: "TCK-005",
    emitterOrganizationId: "6922329a8ccb1dad820973a0",
    recipientOrganizationId: "6922329a8ccb1dad820973a7",
    associatedOrganizations: [],
    formName: "demande de tarif",
    status: "open",
    priority: "high",
    pj: "form_client.pdf",
    message: "Demande de tarif pour gros volumes.",
    comments: [],
    specialFields: {
      wilaya: "alger",
      station: "Station Alger Centre",
      volume: 3000,
      nature: "Pièces mécaniques"
    },
    AssignedTo: {
      name: "69223464abc73498c717774c",
      date: "2025-02-04"
    },
    AssignementHistory: [
      {
        name: "69223464abc73498c7177746",
        date: "2025-01-29"
      }
    ],
    updatedAt: new Date()
  },

  {
    creator: "69223464abc73498c717774b",
    ref: "TCK-006",
    emitterOrganizationId: "6922329a8ccb1dad820973a7",
    recipientOrganizationId: "6922329a8ccb1dad8209739f",
    associatedOrganizations: [],
    formName: "reclamation client",
    status: "open",
    priority: "medium",
    pj: null,
    message: "Client mécontent du retard.",
    comments: [],
    specialFields: {
      type: "retard de livraison"
    },
    AssignedTo: null,
    AssignementHistory: [],
    updatedAt: new Date()
  },

  {
    creator: "69223464abc73498c7177745",
    ref: "TCK-007",
    emitterOrganizationId: "6922329a8ccb1dad8209739f",
    recipientOrganizationId: "6922329a8ccb1dad820973a6",
    associatedOrganizations: [],
    formName: "colis perdu",
    status: "open",
    priority: "high",
    pj: "preuve.png",
    message: "Colis perdu durant transfert.",
    comments: [],
    specialFields: {
      date: "2025-02-01",
      type: "echange",
      client: "Fouad",
      sac: "SAC-405",
      depart: "organisations"
    },
    AssignedTo: {
      name: "69223464abc73498c7177744",
      date: "2025-02-06"
    },
    AssignementHistory: [],
    updatedAt: new Date()
  },

  {
    creator: "69223464abc73498c717774d",
    ref: "TCK-008",
    emitterOrganizationId: "6922329a8ccb1dad820973a6",
    recipientOrganizationId: "6922329a8ccb1dad820973a5",
    associatedOrganizations: [],
    formName: "demande de tarif",
    status: "open",
    priority: "low",
    pj: null,
    message: "Demande de tarif standard.",
    comments: [],
    specialFields: {
      wilaya: "blida",
      station: "Station Blida Nord",
      volume: 900,
      nature: "Textile"
    },
    AssignedTo: null,
    AssignementHistory: [],
    updatedAt: new Date()
  },

  {
    creator: "69223464abc73498c7177746",
    ref: "TCK-009",
    emitterOrganizationId: "6922329a8ccb1dad820973a4",
    recipientOrganizationId: "6922329a8ccb1dad820973a1",
    associatedOrganizations: [],
    formName: "reclamation client",
    status: "open",
    priority: "medium",
    pj: null,
    message: "Réclamation autre.",
    comments: [],
    specialFields: {
      type: "autre"
    },
    AssignedTo: {
      name: "69223464abc73498c717774d",
      date: "2025-02-03"
    },
    AssignementHistory: [],
    updatedAt: new Date()
  },

  {
    creator: "69223464abc73498c717774c",
    ref: "TCK-010",
    emitterOrganizationId: "6922329a8ccb1dad820973a3",
    recipientOrganizationId: "6922329a8ccb1dad8209739e",
    associatedOrganizations: [],
    formName: "colis perdu",
    status: "open",
    priority: "low",
    pj: null,
    message: "Colis introuvable depuis 48h.",
    comments: [],
    specialFields: {
      date: "2025-02-02",
      type: "livraison",
      client: "Amina",
      sac: "SAC-520",
      depart: "organisations"
    },
    AssignedTo: null,
    AssignementHistory: [],
    updatedAt: new Date()
  }
]


//await (tickets.forEach(async(t)=>await ticketModel.create(t)))


app.use("/api/auth", authRouter);
app.use("/api/organisations",protect, organisationRouter);
app.use("/api/forms",protect, formRouter);
app.use("/api/tickets",protect, ticketRouter);
app.use("/api/comment",protect, commentRouter);



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
