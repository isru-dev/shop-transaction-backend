
const express = require("express");
const Transaction = require("../models/Transaction");
const { parseTransaction } = require("../utils/transactionParser");

const router = express.Router();

router.post("/webhook/transaction", async (req, res) => {
  try {
    // Authenticate the request from MacroDroid.
    const suppliedSecret = req.get("x-webhook-secret");
    const expectedSecret = process.env.WEBHOOK_SECRET;

    if (!expectedSecret || suppliedSecret !== expectedSecret) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request",
      });
    }

    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Request body must contain a non-empty message string",
      });
    }

    // Parse the original bank notification.
    let parsed;

    try {
      parsed = parseTransaction(message);
    } catch (error) {
      return res.status(422).json({
        success: false,
        message: "Could not parse transaction notification",
        error: error.message,
      });
    }

    // If a reference exists, check whether we already saved it.
    if (parsed.reference) {
      const existing = await Transaction.findOne({
        provider: parsed.provider,
        reference: parsed.reference,
      });

      if (existing) {
        return res.status(200).json({
          success: true,
          duplicate: true,
          message: "Transaction already exists",
          transaction: {
            id: existing._id,
            provider: existing.provider,
            amount: existing.amount,
            sender: existing.sender,
            reference: existing.reference,
            transactionDate: existing.transactionDate,
          },
        });
      }
    }

    const transaction = await Transaction.create(parsed);

    return res.status(201).json({
      success: true,
      duplicate: false,
      message: "Transaction saved successfully",
      transaction: {
        id: transaction._id,
        provider: transaction.provider,
        amount: transaction.amount,
        sender: transaction.sender,
        reference: transaction.reference,
        transactionDate: transaction.transactionDate,
        smsSent: transaction.smsSent,
      },
    });
  } catch (error) {
    // Handle a duplicate reference if two requests arrive simultaneously.
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        duplicate: true,
        message: "Transaction already exists",
      });
    }

    console.error("Transaction webhook error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
