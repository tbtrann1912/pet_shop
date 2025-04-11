const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const petRoutes = require("./routes/pets");

dotenv.config();
const app = express();

// Kết nối MongoDB
// server.js
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000, // Tăng timeout lên 30 giây
    socketTimeoutMS: 45000, // Timeout cho socket
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method")); // Hỗ trợ PUT/DELETE
app.use(express.static("public")); // Thư mục tĩnh
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// Routes
app.use("/pets", petRoutes);

// Trang chủ
app.get("/", (req, res) => {
  res.redirect("/pets");
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
