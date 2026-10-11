
require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const transactionRoutes = require("./routes/transactionWebhook");
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Shop transaction backend is running",
  });
});
app.use("/api", transactionRoutes);
async function startServer() {
  await connectDB();

 const port = process.env.PORT || 5000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
}

startServer();
