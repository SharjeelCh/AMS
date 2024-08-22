const express = require("express");
const router = express.Router();
const {
 verifyToken,
 Signup,
 Login,
 updateProfile,
 markAttendance,
 getAttendanceState,
 getReports,
} = require("../Controllers/userController");

router.post("/signup", Signup);
router.get("/verify/:token", verifyToken);
router.post("/Login", Login);
router.put("/updateProfile/:email", updateProfile);
router.put("/markAttendance/:user_id", markAttendance);
router.get("/getAttendanceState/",getAttendanceState)
router.get("/getReports/:id",getReports)

module.exports = router;
