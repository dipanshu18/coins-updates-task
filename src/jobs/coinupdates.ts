import axios, { AxiosError } from "axios";
import { coinupdatesModel } from "../models/coinupdates.model";

import dotenv from "dotenv";
dotenv.config();

const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY as string;

interface ICoinUpdates {
  id: string;
  current_price: number;
  market_cap: number;
  price_change_24h: number;
}

export async function fetchCoinUpdates() {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum%2C%20matic-network";

  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        "x-cg-demo-api-key": COINGECKO_API_KEY,
      },
    });

    if (response.status === 200) {
      const data = (await response.data) as ICoinUpdates[];

      console.log(`Coin Updates fetched on ${new Date().toLocaleString()}`);

      data.map(async (coin) => {
        const coinData: ICoinUpdates = {
          id: "",
          current_price: 0,
          market_cap: 0,
          price_change_24h: 0,
        };
        coinData["id"] = coin.id;
        coinData["current_price"] = Number(coin.current_price);
        coinData["market_cap"] = Number(coin.market_cap);
        coinData["price_change_24h"] = Number(coin.price_change_24h);

        await coinupdatesModel.create({
          coin: coinData.id,
          price: coinData.current_price,
          marketCap: coinData.market_cap,
          "24hChange": coinData.price_change_24h,
        });
      });
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("Error:", error);
    }
  }
}
