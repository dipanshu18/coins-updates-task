import express from "express";
import { getDeviation, getStats } from "../controllers/coin.controller";

const coinRouter = express.Router();

coinRouter.get("/stats", getStats);

coinRouter.get("/deviation", getDeviation);

export { coinRouter };
