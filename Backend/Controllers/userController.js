const asyncHandler = require("express-async-handler");
const nodeMalier = require("nodemailer");
require("dotenv").config("../.env");
const crypto = require("crypto");
const User = require("../Modals/userModal");
const userAttendance = require("../Modals/userAttendanceModal");
const reports = require("../Modals/reports");

const transporter = nodeMalier.createTransport({
 host: "smtp.gmail.com",
 port: 587,
 secure: false,
 auth: {
  user: process.env.USER_EMAIL,
  pass: process.env.USER_PASSWORD,
 },
});

const sendToken = asyncHandler(async (req, res) => {
 const token = crypto.randomBytes(20).toString("hex");
 const email = req.body.email;

 await User.updateOne(
  { email },
  { verificationToken: token, isVerified: true }
 );

 var info = {
  from: process.env.USER_EMAIL,
  to: email,
  subject: "Verification Token",
  html: `Press <a href="http://localhost:${process.env.PORT}/verify/${token}">here</a> to verify your account`,
 };

 transporter.sendMail(info, (err, data) => {
  if (err) {
   
   res.status(500).json({ message: "Error sending email" });
  } else {
   
   res.status(200).json({ message: "Verification email sent" });
  }
 });
});

const verifyToken = asyncHandler(async (req, res) => {
 const token = req.params.token;
 const user = await User.findOne({ verificationToken: token });

 if (user) {
  user.isVerified = true;
  user.verificationToken = undefined;

  await user.save();
  res.status(200).json({ message: "User verified" });
 } else {
  res.status(400).json({ message: "Invalid Token" });
 }
});

const Signup = asyncHandler(async (req, res) => {
 const { first_name, last_name, email, password } = req.body;
 if (!first_name || !last_name || !email || !password) {
  res.status(400);
  throw new Error("All fields are required");
 }
 const checkAlreadyUser = await User.findOne({ email });
 if (checkAlreadyUser) {
  res.status(400);
  res.json({ message: "User already exists" });
  throw new Error("User already exists");
 }
 const newUser = new User({
  first_name,
  last_name,
  email,
  password,
  verificationToken: undefined,
  isVerified: true,
 });
 await newUser.save();
 sendToken(req, res);
});

const Login = asyncHandler(async (req, res) => {
 const { email, password } = req.body;

 if (!email || !password) {
  res.status(400).json({ message: "All fields are required" });
  return;
 }

 const checkUserinDB = await User.findOne({ email });

 if (checkUserinDB) {
  if (checkUserinDB.isVerified) {
   if (checkUserinDB.password === password) {
    res.status(200).json({ message: "User logged in", data: checkUserinDB });
   } else {
    res.status(400).json({ message: "Invalid password" });
   }
  } else {
   res.status(400).json({ message: "User not verified" });
  }
 } else {
  res.status(400).json({ message: "User not found" });
 }
});

const updateProfile = asyncHandler(async (req, res) => {
 const email = req.params.email;
 const { first_name, last_name, profile_image } = req.body;

 const checkUser = await User.findOne({ email });
 if (checkUser) {
  checkUser.first_name = first_name;
  checkUser.last_name = last_name;

  if (profile_image) {
   checkUser.profileImage = profile_image;
  }

  await checkUser.save();
  res.status(200).json({ message: "Profile updated" });
 } else {
  res.status(400).json({ message: "User not found" });
 }
});

const markAttendance = asyncHandler(async (req, res) => {
 const user_id = req.params.user_id;
 const { user_name, status, reason, date } = req.body;

 const attendanceDate = new Date(date).toISOString().split("T")[0];

 const checkUser = await userAttendance.findOne({ user_id: user_id });

 if (checkUser) {
  const existingAttendance = checkUser.attendance.find(
   (item) => item.date.toISOString().split("T")[0] === attendanceDate
  );

  if (existingAttendance) {
   res.status(400).json({ message: "Attendance already marked for this date" });
   return;
  }

  const attendanceRecord = {
   date,
   status,
   reason,
   state: status === "Leave" ? "Pending" : "Approved",
  };

  checkUser.attendance.push(attendanceRecord);
  checkUser.username = user_name;

  const totalApproved = checkUser.attendance.filter(
   (record) => record.state === "Approved"
  ).length;

  const totalPresents = checkUser.attendance.filter(
   (record) => record.status === "Present" && record.state === "Approved"
  ).length;

  const attendancePercentage = (totalPresents / totalApproved) * 100;

  checkUser.percentage = attendancePercentage.toFixed(2);

  await checkUser.save();

  res.status(200).json({
   message: "Attendance marked successfully",
   percentage: checkUser.percentage,
  });
 } else {
  const attendanceRecord = {
   date,
   status,
   reason,
   state: status === "Leave" ? "Pending" : "Approved",
  };

  const newUser = new userAttendance({
   user_id: user_id,
   username: user_name,
   attendance: [attendanceRecord],
   percentage: status === "Present" ? 100 : 0,
  });

  await newUser.save();

  res.status(200).json({
   message: "Attendance marked successfully",
   percentage: newUser.percentage,
  });
 }
});

const getAttendanceState = asyncHandler(async (req, res) => {
 const user_id = req.query.user_id;
 const checkUser = await userAttendance.findOne({ user_id });
 if (checkUser) {
  res.status(200).json({ data: checkUser });
 } else {
  res.status(400).json({ message: "User not found" });
 }
});

const getReports = asyncHandler(async (req, res) => {
 const { id } = req.params;
 const checkUser = await reports.find({ id: id });
 if (checkUser) {
  res.status(200).json({ data: checkUser });
 } else {
  res.status(400).json({ message: "User not found" });
 }
});

module.exports = {
 Signup,
 verifyToken,
 sendToken,
 Login,
 updateProfile,
 markAttendance,
 getAttendanceState,
 getReports,
};
