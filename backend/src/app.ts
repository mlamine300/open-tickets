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
import organisationModel from "./models/Organisation.js";

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


app.use("/api/auth", authRouter);
app.use("/api/organisations",protect, organisationRouter);
app.use("/api/forms",protect, formRouter);
app.use("/api/tickets",protect, ticketRouter);
app.use("/api/comments",protect, commentRouter);
app.use("/api/users",protect, userRouter);
app.use("/api/stat",protect,statRouter)


app.use(
  "/uploads",
  express.static(path.join(path.dirname(__dirname), "uploads"))
);

const stations = [
{name:'STATION NAAMA MECHRIA',wilaya:'Naama',address:'Mechria Centre',phone:'0774031171'},
{name:'STATION MAGHNIA',wilaya:'Tlemcen',address:'Route d Oujda',phone:'0770845020'},
{name:'STATION BAB EL OUED',wilaya:'Alger',address:'Bab El Oued Centre',phone:'0770807083'},
{name:'STATION LAGHOUAT',wilaya:'Laghouat',address:'Citï¿½ Bouameur Maamourah',phone:'0770953193'},
{name:'STATION CONSTANTINE SIDI MABROUK',wilaya:'Constantine',address:'Sidi Mabrouk',phone:'0770797329'},
{name:'STATION BISKRA',wilaya:'Biskra',address:'Coopï¿½rative immobiliï¿½re El Izdihar',phone:'0770522149'},
{name:'STATION TIARET',wilaya:'Tiaret',address:'Proche Radio Tiaret Centre-ville',phone:'0770750979'},
{name:'STATION SACRE COEUR',wilaya:'Alger',address:'Sacrï¿½ Coeur Alger Centre',phone:'0770808228'},
{name:'STATION JIJEL',wilaya:'Jijel',address:'02 Rue des Moudjahidine',phone:'0770300919'},
{name:'STATION KOLEA',wilaya:'Tipaza',address:'Kolea Centre',phone:'0770912305'},
{name:'STATION BECHAR',wilaya:'Bechar',address:'Hai El Badr 600 logements',phone:'0770451153'},
{name:'STATION AIN TEMOUCHENT',wilaya:'Ain Temouchent',address:'Ain Temouchent Centre',phone:'0770868817'},
{name:'STATION SETIF VILLE',wilaya:'Setif',address:'Setif Centre-ville',phone:'0770898787'},
{name:'STATION CONSTANTINE ALI MENDJELI',wilaya:'Constantine',address:'Ali Mendjeli',phone:'0770753443'},
{name:'STATION OUED RHIOU',wilaya:'Relizane',address:'Oued Rhiou Centre',phone:'0770899295'},
{name:'STATION MEDEA',wilaya:'Medea',address:'Pï¿½le urbain Mï¿½dï¿½a',phone:'0770091207'},
{name:'STATION MSILA',wilaya:'M sila',address:'Citï¿½ El Makrani',phone:'0770164280'},
{name:'STATION CHLEF',wilaya:'Chlef',address:'Hai Chergui Lassia Rue 1er Novembre',phone:'0770776674'},
{name:'STATION BOU SAADA',wilaya:'M sila',address:'Bou Saada Centre',phone:'0770898651'},
{name:'STATION EUCALYPTUS',wilaya:'Alger',address:'Eucalyptus Alger',phone:'0770163989'},
{name:'STATION BLIDA',wilaya:'Blida',address:'Rue Ramoul Abdelaziz Nï¿½17',phone:'0770967048'},
{name:'STATION BOUMERDES',wilaya:'Boumerdes',address:'Citï¿½ 11 Dï¿½cembre',phone:'0770912531'},
{name:'STATION HADJOUT',wilaya:'Tipaza',address:'Hadjout Centre',phone:'0770807997'},
{name:'STATION DRARIA',wilaya:'Alger',address:'Quartier Driouche Draria',phone:'0770808759'},
{name:'STATION REGHAIA',wilaya:'Alger',address:'Citï¿½ 822 logements Amirouche Reghaia',phone:'0770012586'},
{name:'STATION BORDJ EL BAHRI',wilaya:'Alger',address:'Bordj El Bahri Alger Plage',phone:'0770912158'},
{name:'STATION ANNABA',wilaya:'Annaba',address:'11 Rue Necib Arifa',phone:'0770451061'},
{name:'STATION DJANET',wilaya:'Djanet',address:'Djanet Centre',phone:'0698502737'},
{name:'STATION OUED SMAR',wilaya:'Alger',address:'Zone industrielle Oued Smar',phone:'0770912502'},
{name:'STATION HASSI MESSAOUD',wilaya:'Ouargla',address:'Hassi Messaoud Centre',phone:'0674273120'},
{name:'STATION TLEMCEN',wilaya:'Tlemcen',address:'Kiffane Lot Benchaib',phone:'0770451113'},
{name:'STATION BOUFARIK',wilaya:'Blida',address:'Rue Si Benyoucef',phone:'0770808317'},
{name:'STATION DJELFA',wilaya:'Djelfa',address:'Hai Mohamed Chaabani',phone:'0770118242'},
{name:'STATION GHARDAIA',wilaya:'Ghardaia',address:'Ghardaia Centre',phone:'0770290590'},
{name:'STATION MILA',wilaya:'Mila',address:'Tounsi Mila',phone:'0770300878'},
{name:'STATION TEBESSA',wilaya:'Tebessa',address:'Lotissement El Arbi Tebessi',phone:'0659463130'},
{name:'STATION KOUBA',wilaya:'Alger',address:'Ferme Pons Garidi Kouba',phone:'0770118214'},
{name:'STATION BORDJ BOU ARRERIDJ',wilaya:'Bordj Bou Arreridj',address:'Bordj Bou Arreridj Centre',phone:'0770520516'},
{name:'STATION ILLIZI',wilaya:'Illizi',address:'Illizi Centre',phone:'0791917907'},
{name:'STATION TIPAZA',wilaya:'Tipaza',address:'Citï¿½ 50+20 logements',phone:'0770797338'},
{name:'STATION AZAZGA',wilaya:'Tizi Ouzou',address:'Local Nï¿½01 Azazga',phone:'0770898601'},
{name:'STATION ADRAR',wilaya:'Adrar',address:'Hai Saguane proche Mosquï¿½e Imam El Meghili',phone:'0660709353'},
{name:'STATION AKBOU',wilaya:'Bejaia',address:'Trï¿½mie Guendouza Avenue Mohamed Boudiaf',phone:'0770807317'},
{name:'STATION OUARGLA',wilaya:'Ouargla',address:'Ouargla Centre',phone:'0770559675'},
{name:'STATION CHERAGA',wilaya:'Alger',address:'Quartier Issat Idir Cheraga',phone:'0770114789'},
{name:'STATION SETIF EL EULMA',wilaya:'Setif',address:'El Eulma Centre',phone:'0770521261'},
{name:'STATION AIN DEFLA',wilaya:'Ain Defla',address:'Ain Defla Centre',phone:'0770780589'},
{name:'STATION AIN OUSSARA',wilaya:'Djelfa',address:'Ain Oussara Centre',phone:'0791917766'},
{name:'STATION MOSTAGANEM',wilaya:'Mostaganem',address:'24 Rue Bouzourar Miloud',phone:'0770371420'},
{name:'STATION OUM EL BOUAGHI',wilaya:'Oum El Bouaghi',address:'Citï¿½ El Mostakbal prï¿½s de la Wilaya',phone:'0770521708'},
{name:'STATION RELIZANE',wilaya:'Relizane',address:'Relizane Centre',phone:'0770783044'},
{name:'STATION TAMENRASSET',wilaya:'Tamanrasset',address:'Quartier Mouflon',phone:'0770780713'},
{name:'STATION EL BOUNI',wilaya:'Annaba',address:'El Bouni Centre',phone:'0770336039'},
{name:'STATION SETIF AIN OULMANE',wilaya:'Setif',address:'Ain Oulmane Centre',phone:'0770751081'},
{name:'STATION EL BAYADH',wilaya:'El Bayadh',address:'El Bayadh Centre',phone:'0697603262'},
{name:'STATION BEJAIA',wilaya:'Bejaia',address:'Zone industrielle EDIMCO Section 2 Bï¿½timent A',phone:'0770114762'},
{name:'STATION SETIF EL HIDHAB',wilaya:'Setif',address:'El Hidhab Setif',phone:'0770876522'},
{name:'STATION BATNA',wilaya:'Batna',address:'Hai Bordj El Ghoulah route usine textile',phone:'0770518901'},
{name:'STATION AIN BENIAN',wilaya:'Alger',address:'Ain Benian Centre',phone:'0560513231'},
{name:'STATION BOUIRA',wilaya:'Bouira',address:'Hai 24 logements participatifs',phone:'0770780702'},
{name:'STATION TOUGGOURT',wilaya:'Touggourt',address:'Touggourt Centre',phone:'0770999634'},
{name:'STATION EL MGHAIR',wilaya:'El Mghair',address:'El Mghair Centre',phone:'0770898640'},
{name:'STATION TIZI OUZOU',wilaya:'Tizi Ouzou',address:'Local N2 Rez-de-chaussï¿½e',phone:'0770724616'}

];

  //await organisationModel.insertMany(stations);

// Sanitize PORT: remove any non-digit characters and parse to integer
const rawPort = String(process.env.PORT ?? "").trim();
const numericPort = parseInt(rawPort.replace(/[^0-9]/g, ""), 10);
const PORT =
  Number.isFinite(numericPort) && numericPort > 0 ? numericPort : 3500;

  
app.listen(PORT, (err?: Error) => {
  if (err) console.error("Server failed to start:", err);
  console.log(`Server running on port ${PORT}`);
});
