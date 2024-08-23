const express = require("express");
const cors = require("cors"); // Import CORS middleware
const connectDB = require("./Connection/dbConnection");
const userRoutes = require("./Routes/userRoutes");
const adminRoutes = require("./Routes/adminRoutes");

const PORT = process.env.PORT || 5003;

connectDB();

const app = express();
app.use(express.json());

const corsOptions = {
 origin: [
  "http://localhost:5173", 
  "https://ams-exvhbfycy-sharjeel-fida-chs-projects.vercel.app",
 ],
 methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
 allowedHeaders: ["Content-Type", "Authorization"],
 credentials: true,
};
app.use(cors(corsOptions));

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
