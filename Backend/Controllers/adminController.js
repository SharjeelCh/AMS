const asyncHandler = require("express-async-handler");
const adminModal = require("../Modals/adminModal");
const userModal = require("../Modals/userModal");
const userAttendanceModal = require("../Modals/userAttendanceModal");
const reportModal = require("../Modals/reports");
const { get } = require("mongoose");
const GradingCriteria = require("../Modals/grading");

const getAdmin = asyncHandler(async (req, res) => {
 const { email, password } = req.body;
 if (!email || !password) {
  res.status(400).json({ message: "All fields are required" });
  return;
 }
 const checkAdmininDB = await adminModal.findOne({ email });
 if (checkAdmininDB) {
  if (checkAdmininDB.password === password) {
   res.status(200).json({ message: "Admin logged in", data: checkAdmininDB });
  } else {
   res.status(400).json({ message: "Invalid password" });
  }
 } else {
  res.status(400).json({ message: "Admin not found" });
 }
});

const getOverAllInfo = asyncHandler(async (req, res) => {
 const totalUsers = await userModal.countDocuments();
 const totalAttendance = await userAttendanceModal.find({
  attendance: { $exists: true },
 });
 const pendingLeaves = await userAttendanceModal.find({
  attendance: { $elemMatch: { status: "Leave", state: "Pending" } },
 });
 const approvedLeaves = await userAttendanceModal.find({
  attendance: { $elemMatch: { status: "Leave", state: "Approved" } },
 });

 res.status(200).json({
  totalUsers,
  totalAttendance: totalAttendance.length,
  pendingLeaves: pendingLeaves.length,
  approvedLeaves: approvedLeaves.length,
 });
});

const userInfo = asyncHandler(async (req, res) => {
 try {
  const users = await userModal.find({}, { password: 0, verificationToken: 0 });

  if (!users || users.length === 0) {
   return res.status(404).json({ message: "No users found" });
  }

  const userIds = users.map((user) => user._id);

  const userAttendances = await userAttendanceModal.find({
   user_id: { $in: userIds },
  });

  const daysPresent = await userAttendanceModal.aggregate([
   { $match: { user_id: { $in: userIds }, "attendance.status": "Present" } },
   { $unwind: "$attendance" },
   { $match: { "attendance.status": "Present" } },
   { $group: { _id: "$user_id", count: { $sum: 1 } } },
  ]);

  const daysAbsent = await userAttendanceModal.aggregate([
   { $match: { user_id: { $in: userIds }, "attendance.status": "Absent" } },
   { $unwind: "$attendance" },
   { $match: { "attendance.status": "Absent" } },
   { $group: { _id: "$user_id", count: { $sum: 1 } } },
  ]);

  const daysLeave = await userAttendanceModal.aggregate([
   {
    $match: {
     user_id: { $in: userIds },
     "attendance.status": "Leave",
     "attendance.state": "Approved",
    },
   },
   { $unwind: "$attendance" },
   { $match: { "attendance.status": "Leave", "attendance.state": "Approved" } },
   { $group: { _id: "$user_id", count: { $sum: 1 } } },
  ]);

  const daysPresentMap = {};
  daysPresent.forEach((item) => {
   daysPresentMap[item._id] = item.count;
  });

  const daysAbsentMap = {};
  daysAbsent.forEach((item) => {
   daysAbsentMap[item._id] = item.count;
  });

  const daysLeaveMap = {};
  daysLeave.forEach((item) => {
   daysLeaveMap[item._id] = item.count;
  });

  const usersWithAttendance = users.map((user) => {
   const present = daysPresentMap[user._id] || 0;
   const absent = daysAbsentMap[user._id] || 0;
   const leave = daysLeaveMap[user._id] || 0;
   const totalDays = present + absent + leave;
   const percentage = totalDays > 0 ? (present / totalDays) * 100 : 0;

   return {
    user,
    attendance: userAttendances.filter((attendance) =>
     attendance.user_id.equals(user._id)
    ),
    daysPresent: present,
    daysAbsent: absent,
    daysLeave: leave,
    percentage: percentage.toFixed(2),
   };
  });

  res.status(200).json(usersWithAttendance);
 } catch (error) {
  res.status(500).json({ message: error.message });
 }
});

const sendReportsToAll = asyncHandler(async (req, res) => {
 const userData = req.body;

 if (!Array.isArray(userData)) {
  return res.status(400).json({ message: "Invalid data" });
 }

 const reportPromises = userData.map(async (user) => {
  const { id, name, daysPresent, daysAbsent, percentage, state } = user;
  const newReport = new reportModal({
   id,
   name,
   daysPresent,
   daysAbsent,
   percentage,
   state,
  });
  return newReport.save();
 });

 try {
  await Promise.all(reportPromises);
  res.status(200).json({ message: "Reports sent to all users" });
 } catch (error) {
  res.status(400).json({ message: "Reports not sent", error: error.message });
 }
});

const getPendingLeaves = asyncHandler(async (req, res) => {
 try {
  const pendingLeaves = await userAttendanceModal.aggregate([
   { $unwind: "$attendance" },
   { $match: { "attendance.state": "Pending" } },
   {
    $project: {
     userId: "$user_id",
     leaveId: "$attendance._id",
     username: "$username",
     leaveDate: "$attendance.date",
     reason: "$attendance.reason",
     status: "$attendance.state",
    },
   },
  ]);

  res.status(200).json(pendingLeaves);
 } catch (error) {
  res.status(500).json({ message: error.message });
 }
});

const leaveApproval = asyncHandler(async (req, res) => {
 const { userId, leaveId, action } = req.body;

 if (!userId || !leaveId || !action) {
  return res.status(400).json({ message: "Invalid data" });
 }

 try {
  const userAttendance = await userAttendanceModal.findOne({ user_id: userId });
  if (!userAttendance) {
   return res.status(404).json({ message: "User attendance record not found" });
  }

  const leaveRecord = userAttendance.attendance.id(leaveId);
  if (!leaveRecord) {
   return res.status(404).json({ message: "Leave record not found" });
  }

  leaveRecord.state = action === "approved" ? "Approved" : "Rejected";

  await userAttendance.save();

  res.status(200).json({ message: `Leave ${action} successfully` });
 } catch (error) {
  res.status(500).json({ message: error.message });
 }
});

const getGradingCriteria = asyncHandler(async (req, res) => {
 try {
  const criteria = await GradingCriteria.find();
  res.status(200).json(criteria);
 } catch (error) {
  res.status(500).json({ message: "Error fetching grading criteria", error });
 }
});

const addOrUpdateGradingCriteria = asyncHandler(async (req, res) => {
 const { threshold, grade, id } = req.body;

 try {
  if (id) {
   const updatedCriteria = await GradingCriteria.findByIdAndUpdate(
    id,
    { threshold, grade },
    { new: true }
   );
   res.status(200).json(updatedCriteria);
  } else {
   const newCriteria = new GradingCriteria({ threshold, grade });
   await newCriteria.save();
   res.status(201).json(newCriteria);
  }
 } catch (error) {
  console.error("Error saving grading criteria:", error);
  res.status(500).json({ message: "Error saving grading criteria", error });
 }
});

const deleteGradingCriteria = asyncHandler(async (req, res) => {
 const { id } = req.params;

 try {
  await GradingCriteria.findByIdAndDelete(id);
  res.status(200).json({ message: "Grading criteria deleted successfully" });
 } catch (error) {
  res.status(500).json({ message: "Error deleting grading criteria", error });
 }
});

module.exports = {
 getAdmin,
 getOverAllInfo,
 userInfo,
 sendReportsToAll,
 leaveApproval,
};

module.exports = {
 getAdmin,
 getOverAllInfo,
 userInfo,
 sendReportsToAll,
 leaveApproval,
 getPendingLeaves,
 getGradingCriteria,
 addOrUpdateGradingCriteria,
 deleteGradingCriteria,
};
