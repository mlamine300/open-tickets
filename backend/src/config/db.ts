import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    mongoose.set('debug', true);
    await mongoose.connect(process.env.MONGO_DB_URI || "", {});
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB could not connect", error);
    process.exit(1);
  }
};

export default connectToDB;
