
function detectProvider(message) {
  const text = message.toLowerCase();

  if (text.includes("telebirr")) {
    return "Telebirr";
  }

  if (
    text.includes("commercial bank of ethiopia") ||
    text.includes("thanks for banking with cbe") ||
    /\bcbe\b/i.test(message)
  ) {
    return "CBE";
  }

  return null;
}

function parseTransaction(message) {
  if (typeof message !== "string" || !message.trim()) {
    throw new Error("A non-empty transaction message is required");
  }

  const rawMessage = message.trim();
  
const provider = detectProvider(rawMessage);

if (!provider) {
  throw new Error("Could not identify the payment provider");
}

// Require an incoming-payment phrase before extracting fields.
const incomingPayment =
  /you have received\s+ETB\s*[\d,]+(?:\.\d{1,2})?/i.test(rawMessage);

if (!incomingPayment) {
  throw new Error("Message is not a recognized incoming payment");
}


  let amount;
  let sender = "Unknown";
  let reference = null;
  let transactionDate = null;

  if (provider === "CBE") {
    const amountMatch = rawMessage.match(
      /received\s+ETB\s*([\d,]+(?:\.\d{1,2})?)\s+from\s+account\b/i
    );

    const senderMatch = rawMessage.match(
      /from\s+account\b.*?\(([^)]+)\)\s+to your account/i
    );
const receiptMatch = rawMessage.match(
  /https?:\/\/mbreciept\.cbe\.com\.et\/[^\s)]+/i
);

if (receiptMatch) {
  reference = receiptMatch[0]
    .replace(/[.,]+$/, "")
    .trim();
}
    if (!amountMatch) {
      throw new Error("Could not extract the CBE received amount");
    }

    amount = Number(amountMatch[1].replace(/,/g, ""));

    if (senderMatch) {
      sender = senderMatch[1].trim();
    }
  }

  if (provider === "Telebirr") {
    const amountMatch = rawMessage.match(
      /received\s+ETB\s*([\d,]+(?:\.\d{1,2})?)\s+from\b/i
    );

    const senderMatch = rawMessage.match(
      /received\s+ETB\s*[\d,]+(?:\.\d{1,2})?\s+from\s+(.+?)\s*\([^)]*\)\s+on\s+/i
    );

    const referenceMatch = rawMessage.match(
      /transaction number is\s+([A-Z0-9]+)/i
    );

    const dateMatch = rawMessage.match(
      /\bon\s+(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/i
    );

    if (!amountMatch) {
      throw new Error("Could not extract the Telebirr received amount");
    }

    amount = Number(amountMatch[1].replace(/,/g, ""));

    if (senderMatch) {
      sender = senderMatch[1].trim();
    }

    if (referenceMatch) {
      reference = referenceMatch[1];
    }

    if (dateMatch) {
      const [, day, month, year, hour, minute, second] = dateMatch;

      // Telebirr message time is interpreted as Ethiopia local time (UTC+3).
      transactionDate = new Date(
        `${year}-${month}-${day}T${hour}:${minute}:${second}+03:00`
      );

      if (Number.isNaN(transactionDate.getTime())) {
        throw new Error("Invalid Telebirr transaction date");
      }
    }
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid transaction amount");
  }

  return {
    provider,
    amount,
    sender,
    reference,
    transactionDate,
    rawMessage,
  };
}

module.exports = {
  detectProvider,
  parseTransaction,
};

