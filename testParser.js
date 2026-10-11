
const { parseTransaction } = require("./utils/transactionParser");

const cbeMessage =
  "Dear Israel Gezahagn Sima You have received ETB 200.00 from account 1****6999 (Kuma Senbaba Lalisa) to your account 1****4967. Your current balance is ETB4,129.42. Thanks for Banking with CBE.";

const telebirrMessage =
  "Dear Israel You have received ETB 380.00 from Degefa Kebeta(2519****4699) on 11/10/2026 09:04:50. Your transaction number is DJB5NU9MX3. Your current E-Money Account balance is ETB 811.00. Thank you for using telebirr Ethio telecom";

for (const message of [cbeMessage, telebirrMessage]) {
  try {
    console.log(parseTransaction(message));
    console.log("-----------------------------");
  } catch (error) {
    console.error("Parsing failed:", error.message);
  }
}

