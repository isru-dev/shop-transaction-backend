
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
      default: null,
      trim: true,
    },

    transactionDate: {
      type: Date,
      default: null,
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

// Only enforce uniqueness when a reference exists.
transactionSchema.index(
  { provider: 1, reference: 1 },
  {
    unique: true,
    partialFilterExpression: {
      reference: { $type: "string" },
    },
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
