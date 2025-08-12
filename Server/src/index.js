import dotenv from "dotenv";
import { connectDB } from "./db";
import {app} from "./app";
dotenv.config();

connectDB()
    .then(()=>{
      app.on("error",(error)=>{
        console.error("MONGODB Connection error: ", error);
      });
      app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
      });
    })
    .catch((error) => {
      console.error("Failed to connect MONGODB: ", error);
      process.exit(1);
    });
