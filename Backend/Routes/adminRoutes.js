const express = require("express");
const {
 getAdmin,
 getOverAllInfo,
 userInfo,
 sendReportsToAll,
 getPendingLeaves,
 leaveApproval,
 getGradingCriteria,
 addOrUpdateGradingCriteria,
 deleteGradingCriteria,
} = require("../Controllers/adminController");
const router = express.Router();

router.post("/adminLogin", getAdmin);
router.get("/getOverAllInfo", getOverAllInfo);
router.get("/userInfo", userInfo);
router.post("/sendReports", sendReportsToAll);
router.get("/pendingLeaves", getPendingLeaves);
router.post("/leaveApproval", leaveApproval);
router.get("/getGradingCriteria", getGradingCriteria);
router.post("/addOrUpdateGradingCriteria", addOrUpdateGradingCriteria);
router.delete("/deleteGradingCriteria/:id", deleteGradingCriteria);


module.exports = router;
