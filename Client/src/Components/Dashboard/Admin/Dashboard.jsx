import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin } from "antd";
import axios from "axios";

const Dashboard = () => {
 const [loading, setLoading] = useState(false);
 const [data, setData] = useState({});

 useEffect(() => {
  const fetchData = async () => {
   setLoading(true);
   try {
    const response = await axios.get(
     "https://ams-exvhbfycy-sharjeel-fida-chs-projects.vercel.app/api/admin/getOverAllInfo"
    );
    setData(response.data);
   } catch (error) {
    console.error("Error fetching data:", error);
   } finally {
    setLoading(false);
   }
  };
  fetchData();
 }, []);

 if (loading)
  return (
   <Spin
    style={{ position: "fixed", top: "50%", bottom: "50%", left: "50%" }}
    spinning
    size="large"
   />
  );

 return (
  <div style={{ padding: 24 }}>
   <Row gutter={[16, 16]}>
    <Col xs={24} sm={12} md={8}>
     <Card
      title="Total Students"
      bordered={false}
      style={{ backgroundColor: "#ff4d4f", color: "white" }} // Red
     >
      {data.totalUsers}
     </Card>
    </Col>
    <Col xs={24} sm={12} md={8}>
     <Card
      title="Total Attendance Records"
      bordered={false}
      style={{ backgroundColor: "#40a9ff", color: "white" }} // Blue
     >
      {data.totalAttendance}
     </Card>
    </Col>
    <Col xs={24} sm={12} md={8}>
     <Card
      title="Pending Leave Requests"
      bordered={false}
      style={{ backgroundColor: "#faad14", color: "white" }} // Orange
     >
      {data.pendingLeaves}
     </Card>
    </Col>
   </Row>
   <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
    <Col xs={24} sm={12} md={8}>
     <Card
      title="Grading System Status"
      bordered={false}
      style={{ backgroundColor: "#52c41a", color: "white" }} // Green
     >
      Active
     </Card>
    </Col>
    <Col xs={24} sm={12} md={8}>
     <Card
      title="Approved Leaves"
      bordered={false}
      style={{ backgroundColor: "#eb2f96", color: "white" }} // Pink
     >
      {data.approvedLeaves}
     </Card>
    </Col>
    <Col xs={24} sm={12} md={8}>
     <Card
      title="System Health"
      bordered={false}
      style={{ backgroundColor: "#13c2c2", color: "white" }} // Teal
     >
      All Systems Operational
     </Card>
    </Col>
   </Row>
  </div>
 );
};

export default Dashboard;
