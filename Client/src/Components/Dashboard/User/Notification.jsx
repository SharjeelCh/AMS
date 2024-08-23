import React, { useEffect, useState } from "react";
import { Card, List, Typography, Badge, message, Spin } from "antd";
import axios from "axios";
import useStore from "../../../createStore";
import moment from "moment";

const Notification = () => {
 const [loading, setLoading] = useState(false);
 const { user } = useStore();
 const [notifications, setNotifications] = useState([]);

 const getType = (state) => {
  switch (state) {
   case "Warning":
    return "danger";
   case "Needs Improvement":
    return "warning";
   default:
    return "info";
  }
 };

 useEffect(() => {
  const fetchData = async () => {
   try {
    setLoading(true);
    const response = await axios.get(
     `https://ams-omega.vercel.app/api/users/getReports/${user.user_id}`
    );
    const newNotifications = response.data.data.map((item) => ({
     title: "Attendance Update",
     description: item.state + ", your attendance is " + item.percentage + "%",
     date: moment(item.createdAt).format("YYYY-MM-DD"),
     type: getType(item.state),
    }));

    setNotifications(newNotifications);
    
   } catch (error) {
    if (error.response && error.response.data) {
     message.error(error.response.data.message);
    } else {
     message.error("An error occurred");
    }
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
  <Card title="Notifications" bordered={false}>
   <List
    itemLayout="horizontal"
    dataSource={notifications}
    renderItem={(item) => (
     <List.Item>
      <List.Item.Meta
       avatar={
        <Badge
         color={
          item.type === "warning"
           ? "orange"
           : item.type === "info"
           ? "blue"
           : "red"
         }
        />
       }
       title={
        <Typography.Text style={{ fontSize: "14px", fontWeight: "bold" }}>
         {item.title}
        </Typography.Text>
       }
       description={
        <Typography.Text style={{ fontSize: "12px", color: "#595959" }}>
         {item.description}
        </Typography.Text>
       }
      />
      <Typography.Text style={{ fontSize: "12px", color: "#8c8c8c" }}>
       {item.date}
      </Typography.Text>
     </List.Item>
    )}
   />
  </Card>
 );
};

export default Notification;
