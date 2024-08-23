import { useEffect, useState } from "react";
import {
 Card,
 Button,
 Radio,
 Typography,
 Form,
 Input,
 message,
 Spin,
} from "antd";
import {
 CheckCircleOutlined,
 ClockCircleOutlined,
 MinusCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import useStore from "../../../createStore";
import axios from "axios";

const { Title, Text } = Typography;

const AttendancePage = () => {
 const [attendanceMarked, setAttendanceMarked] = useState(false);
 const [status, setStatus] = useState(null);
 const [loading, setLoading] = useState(false);
 const [attendancePercentage, setAttendancePercentage] = useState(null);
 const { user } = useStore();
 const currentDate = moment().format("YYYY-MM-DD");

 useEffect(() => {
  const fetchAttendanceState = async () => {
   try {
    setLoading(true);
    const response = await axios.get(
     `http://localhost:5002/api/users/getAttendanceState/`,
     {
      params: {
       user_id: user.user_id,
      },
     }
    );
    const attendanceDates = response.data.data.attendance.map((record) =>
     moment(record.date).format("YYYY-MM-DD")
    );
    if (attendanceDates.includes(currentDate)) {
     const todayRecord = response.data.data.attendance.find(
      (record) => moment(record.date).format("YYYY-MM-DD") === currentDate
     );
     setAttendanceMarked(true);
     setStatus(todayRecord.status);
     setAttendancePercentage(response.data.data.percentage); 
    } else {
     setAttendanceMarked(false);
    }
   } catch (error) {
    message.error(
     error.response?.data?.message || "An unexpected error occurred"
    );
   } finally {
    setLoading(false);
   }
  };

  fetchAttendanceState();
 }, [currentDate, user.user_id]);

 const handleAttendance = async (selectedStatus, reason = "") => {
  if (attendanceMarked) {
   message.warning("You have already marked your attendance for today.");
   return;
  }

  try {
   setLoading(true);
   const response = await axios.put(
    `http://localhost:5002/api/users/markAttendance/${user.user_id}`,
    {
     user_name: `${user.first_name} ${user.last_name}`,
     status: selectedStatus,
     reason: reason,
     date: currentDate,
    }
   );

   setStatus(selectedStatus);
   setAttendanceMarked(true);
   setAttendancePercentage(response.data.attendancePercentage); // Update attendance percentage
   message.success(response.data.message);
  } catch (error) {
   message.error(
    error.response?.data?.message || "An unexpected error occurred"
   );
  } finally {
   setLoading(false);
  }
 };

 const onFinish = (values) => {
  handleAttendance("Leave", values.reason);
 };

 const handleRadioChange = (e) => {
  const selectedStatus = e.target.value;
  console.log(selectedStatus);
  if (selectedStatus !== "Leave") {
   handleAttendance(selectedStatus);
  } else {
   setStatus(selectedStatus);
  }
 };

 if (loading)
  return (
   <Spin
    style={{
     position: "fixed",
     top: "50%",
     left: "50%",
     transform: "translate(-50%, -50%)",
    }}
    spinning
    size="large"
   />
  );

 return (
  <div
   style={{
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column",
    minHeight: "100vh",
    background: "#f0f2f5",
   }}
  >
   <Text type="danger" style={{ fontWeight: "bold" }}>
    Date: {currentDate}
   </Text>

   <Card
    style={{
     width: "100%",
     textAlign: "center",
     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    }}
   >
    <Title level={3}>Record Attendance</Title>
    {!attendanceMarked ? (
     <>
      <Radio.Group
       onChange={handleRadioChange}
       style={{ marginBottom: 20, marginTop: 20 }}
      >
       <Radio.Button value="Present">
        <CheckCircleOutlined style={{ color: "green" }} /> Present
       </Radio.Button>
       <Radio.Button value="Absent">
        <MinusCircleOutlined style={{ color: "red" }} /> Absent
       </Radio.Button>
       <Radio.Button value="Leave">
        <ClockCircleOutlined style={{ color: "yellow" }} /> Leave
       </Radio.Button>
      </Radio.Group>
      {status === "Leave" && (
       <Form onFinish={onFinish} layout="vertical" style={{ marginTop: 20 }}>
        <Form.Item
         name="reason"
         label="Reason for Leave"
         rules={[
          { required: true, message: "Please provide a reason for leave" },
         ]}
        >
         <Input.TextArea rows={3} placeholder="Enter your reason here..." />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
         Submit Leave Request
        </Button>
       </Form>
      )}
     </>
    ) : (
     <div>
      <Title level={4} style={{ marginBottom: 20 }}>
       You have marked your attendance as <strong>{status}</strong> for today.
      </Title>
      <Button type="primary" disabled>
       Attendance Marked
      </Button>
      {attendancePercentage !== null && (
       <div style={{ marginTop: 20 }}>
        <Text strong>Your current attendance percentage: </Text>
        <Text type="success">{attendancePercentage}%</Text>
       </div>
      )}
     </div>
    )}
   </Card>
  </div>
 );
};

export default AttendancePage;
