import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cron from "node-cron";

import dotenv from "dotenv";
import { fetchCoinUpdates } from "./jobs/coinupdates";
dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL as string;
const app = express();

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("LOG:", req.path);
  next();
});

app.listen(PORT, async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("DB connected...");
  } catch (error) {
    console.log("Error:", error);
  }

  console.log("Server listening on port:", PORT);
});

cron.schedule("0 */2 * * *", async () => {
  await fetchCoinUpdates();
});
