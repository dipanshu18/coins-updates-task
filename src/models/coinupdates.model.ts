import mongoose from "mongoose";

const coinupdatesSchema = new mongoose.Schema(
  {
    coin: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    marketCap: {
      type: Number,
      required: true,
    },
    "24hChange": {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const coinupdatesModel = mongoose.model("CoinUpdates", coinupdatesSchema);

export { coinupdatesModel };
