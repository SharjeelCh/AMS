const express = require("express");
const cors = require("cors"); // Import CORS middleware
const connectDB = require("./Connection/dbConnection");
const userRoutes = require("./Routes/userRoutes");
const adminRoutes = require("./Routes/adminRoutes");

const PORT = process.env.PORT || 5003;

connectDB();

const app = express();
app.use(express.json());

app.use(
 cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
 })
);

app.use(
 "/api/users",
 (req, res, next) => {
  console.log("Request URL:", req.url);
  next();
 },
 userRoutes
);

app.use(
 "/api/admin",
 (req, res, next) => {
  console.log("Request URL:", req.url);
  next();
 },
 adminRoutes
);

app.listen(PORT, () => {
 console.log("Server is running on port: ", PORT);
});
