// server/db/connection.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const URI = process.env.ATLAS_URI || "";

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected with Mongoose"))
.catch(err => console.error("MongoDB connection error:", err));

export default mongoose;
