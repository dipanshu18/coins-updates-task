import { Request, Response } from "express";
import { coinupdatesModel } from "../models/coinupdates.model";

export async function getStats(req: Request, res: Response) {
  try {
    const { coin } = req.query;

    const coinLatestUpdate = await coinupdatesModel.findOne(
      {
        coin: coin,
      },
      { createdAt: 0, updatedAt: 0, _id: 0, __v: 0 },
      {
        sort: {
          createdAt: -1,
        },
      }
    );

    if (coinLatestUpdate) {
      res.status(200).json(coinLatestUpdate);
      return;
    }

    res.status(404).json({ msg: `No stats found for ${coin}` });
    return;
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ msg: "Internal server error" });
    return;
  }
}

export async function getDeviation(req: Request, res: Response) {
  try {
    const { coin } = req.query;

    const coinSD = await coinupdatesModel.aggregate([
      {
        $match: {
          coin,
        },
      },
      {
        $group: {
          _id: "$coin",
          deviation: { $stdDevSamp: "$price" },
        },
      },
    ]);

    if (coinSD[0]) {
      res.status(200).json({ deviation: coinSD[0].deviation });
      return;
    }

    res
      .status(404)
      .json({ msg: `Couldn't calculate deviation as no stats for ${coin}` });
    return;
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ msg: "Internal server error" });
    return;
  }
}
