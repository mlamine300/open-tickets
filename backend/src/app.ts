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
import infoRouter from "./routes/infoRoutes.js";
import motifModel from "./models/Motifs.js";
import motifRouter from "./routes/motifRoutes.js";

const addMotifs=async()=>{
   const MOTIFS=[
  "Bureau injoignable - مكتب مُتعذِّر الوصول إليه",
"Bureau fermé - المكتب مغلق",
"Colis endommagé - طرد تالف",
"Colis manquant - طرد مفقود",
"Livraison manquante - تسليم مفقود",
"Retard de livraison - تأخر في التسليم",
"Retard de retour - تأخر في الإرجاع",
"Refus de livraison - رفض التسليم",
"Faux statut / Scan - حالة / مسح غير صحيح",
"Mauvais comportement - سوء السلوك",
"Ouverture sans autorisation - فتح بدون إذن",
"Demandes / Modifications - طلبات / تعديلات",
"Changement de prix - تغيير السعر",
"Changement de numéro - تغيير الرقم",
"Changement de commune - تغيير البلدية",
"Changement du type de livraison - تغيير نوع التسليم",
"Demande de localisation - طلب تحديد الموقع",
"Demande de mise à jour - طلب تحديث",
"Demande de livraison - طلب تسليم",
"Demande de retour - طلب إرجاع",
"Demande d’information - طلب معلومات",
"Conserver le colis / Garder le colis - الاحتفاظ بالطرد",
"Réclamation financière - شكوى مالية",
"Autre réclamation - شكوى أخرى",
"Surfacturation - فواتير زائدة",
"Réacheminement - إعادة التوجيه",
"Faux dispatch - توزيع خاطئ",
"accélération de livraison - تسريع التسليم",
"retour vide - إرجاع فارغ",
"litige et remboursement - نزاع واسترجاع الأموال",
"manque de prefessionnalisme - نقص الاحترافية",
"colis vide - طرد فارغ",
"Colis non validé - طرد غير مُعتمد",
"Colis non dispatché - طرد غير مُوزَّع",
"Navette saturée - الشاحنة ممتلئة",
"Colis double - طرد مكرر",
"Reçu par erreur - تم الاستلام عن طريق الخطأ",


]
const motifs=await motifModel.find({}).lean().exec();
if(motifs.length>=MOTIFS.length)return;
  const motifsNames=motifs.map(x=>x.name);
   MOTIFS.forEach(async(name)=>{
    if(!motifsNames.includes(name)){

      await motifModel.create({ name});
      console.log("adding : "+name)
    }else{
       console.log(name)
    }
  })
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
config();

app.use(express.json());
app.use(cookieParser());
// app.use(cors());
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

 app.set("etag", false);
app.use("/api/auth", authRouter);
app.use("/api/organisations",protect, organisationRouter);
app.use("/api/forms",protect, formRouter);
app.use("/api/tickets",protect, ticketRouter);
app.use("/api/comments",protect, commentRouter);
app.use("/api/users",protect, userRouter);
app.use("/api/stat",protect,statRouter);
app.use("/api/attachement",protect,attachementRouter);
app.use("/api/info",protect,infoRouter);
app.use("/api/motifs",protect,motifRouter)
app.get("/api/test",(req:Request,res:Response)=>{
  console.log("test")
  return res.status(200).json({message:"test",client:process.env.CLIENT_URL,requiestIp:req.ip});
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

  await addMotifs();
app.listen(PORT, (err?: Error) => {
  if (err) console.error("Server failed to start:", err);
  console.log(`Server running on port ${PORT}`);
});



