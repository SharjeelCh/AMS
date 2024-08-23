import { Spin, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import useStore from "../../../createStore";
import axios from "axios";
import moment from "moment";

const columns = [
 {
  title: "Date",
  dataIndex: "date",
  key: "date",
 },
 {
  title: "Status",
  dataIndex: "status",
  key: "status",
  render: (status) => {
   let color = "";
   switch (status) {
    case "Present":
     color = "green";
     break;
    case "Absent":
     color = "red";
     break;
    case "Leave":
     color = "yellow";
     break;
    default:
     color = "blue";
   }
   return <Tag color={color}>{status}</Tag>;
  },
 },
 {
  title: "State",
  dataIndex: "state",
  key: "state",
  render: (state) => {
   let color = "";
   switch (state) {
    case "Approved":
     color = "green";
     break;
    case "Pending":
     color = "yellow";
     break;
    default:
     color = "blue";
   }
   return <Tag color={color}>{state}</Tag>;
  },
 },
];

let data = [];

const AttendanceRecord = () => {
 const { user } = useStore();
 const [loading, setLoading] = useState(false);
 useEffect(() => {
  const fetchAttendanceState = async () => {
   try {
    setLoading(true);
    const response = await axios.get(
     `https://ams-theta-tawny.vercel.app/api/users/getAttendanceState/`,
     {
      params: {
       user_id: user.user_id,
      },
     }
    );
    data = response.data.data.attendance.map((record) => ({
     ...record,
     date: moment(record.date).format("YYYY-MM-DD"),
     status: record.status,
     state: record.state,
    }));
    setLoading(false);
    
   } catch (error) {
    console.error("Error fetching attendance state:", error);
    setLoading(false);
    data = [];
   }
  };

  fetchAttendanceState();
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
  <Table columns={columns} dataSource={data} scroll= {{x:'max-content'}} pagination={{ pageSize: 30 }} />
 );
};

export default AttendanceRecord;
