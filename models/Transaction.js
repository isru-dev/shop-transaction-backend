
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
      enum: ["CBE", "Telebirr"],
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    sender: {
      type: String,
      default: "Unknown",
      trim: true,
    },

    reference: {
      type: String,
      required: true,
      trim: true,
    },

    transactionDate: {
      type: Date,
      required: true,
    },

    rawMessage: {
      type: String,
      required: true,
    },

    smsSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same provider transaction from being saved twice.
transactionSchema.index(
  { provider: 1, reference: 1 },
  { unique: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
