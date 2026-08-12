
import jwt from "jsonwebtoken";

 
export const signAccessToken = (user: any) => {
  return jwt.sign(
   { userId: user._id, role: user.role,organisation:user.organisation,organisationsList:user.organisationsList,activeStatus:user.activeStatus },
    process.env.ACCESS_TOKEN_SECRET || "",
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN_NUMBER || 600000,
    } as jwt.SignOptions
  );
};

export const signRefreshToken = (user: any) => {
  return jwt.sign(
   { userId: user._id, role: user.role,organisation:user.organisation,
    //organisationsList:user.organisationsList,
    activeStatus:user.activeStatus },
    process.env.REFRESH_TOKEN_SECRET || "your_default_refresh_secret",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN_NUMBER || 7*24*60*60*1000,
    } as jwt.SignOptions
  );
};
