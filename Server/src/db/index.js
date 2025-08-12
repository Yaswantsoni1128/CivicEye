import mongoose from "mongoose";
import {DB_NAME} from "../constants/db.js"

export const connectDB = async () => {
  try {
    console.log(`${process.env.MONGODB_URI}/${DB_NAME}`)
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("\nMONGODB CONNECTED! HOST: ",connectionInstance.connection.host);
  } catch (error) {
    console.error("\nMONGODB NOT CONNECTED: ", error);
  process.exit(1);
  }
}