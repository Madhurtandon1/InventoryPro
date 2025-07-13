// src/index.js
import { config } from "dotenv";
config(); // Load .env variables

import { connectDB } from "./db/index.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start the server:", err);
  });
