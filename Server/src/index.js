import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import {app} from "./app.js";
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
