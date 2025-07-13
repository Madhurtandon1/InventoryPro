// src/app.js
import express from "express";
import cookieParser from "cookie-parser";

import morgan from "morgan";

// Route imports
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";


const app = express();

// 🍪 Middleware
import cors from "cors";



const allowedOrigins = [
  "http://localhost:5173",
  "https://inventory-pro-bq8b.vercel.app",
  "https://inventory-pro-bq8b-orbnrc75d-madhurtandons-projects.vercel.app",
  "https://inventory-pro-bq8b-owetghp75-madhurtandons-projects.vercel.app" 
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("🔥 CORS blocked: ", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// 🧩 API Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// 🏠 Default Route
app.get("/", (req, res) => {
  res.send("💡 Inventory & Billing System API is running...");
});

// ❌ 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// 🛡️ Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;