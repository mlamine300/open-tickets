import { allowedOrigin } from "./allowedOrigin.js";

interface CorsOptions {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => void;
  credential: boolean;
  optionsSuccessStatus: number;
}
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigin.indexOf(origin!) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log("not allowed by CORS");
      callback(new Error("not allowed by CORS"));
    }
  },
  credential: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
