import React, { useEffect, useState } from "react";
import { Button, message, Select, Spin, Table } from "antd";
import axios from "axios";

const { Option } = Select;

const Reports = () => {
 const [selectedStudent, setSelectedStudent] = useState(null);
 const [tableData, setTableData] = useState([]);
 const [loading, setLoading] = useState(false);
 const [students, setStudents] = useState([]);
 const [Loading, setloading] = useState(false);

 useEffect(() => {
  const fetchData = async () => {
   setLoading(true);
   try {
    const response = await axios.get(
     "https://ams-theta-tawny.vercel.app/api/admin/userInfo"
    );
    const fetchedData = response.data;
    

    const studentsData = fetchedData.map((student) => {
     const userData = student.attendance;
     const daysPresent = student.daysPresent || 0;
     const daysAbsent = student.daysAbsent || 0;
     const daysLeave = student.daysLeave || 0;
     const totalDays = daysPresent + daysAbsent + daysLeave;

     const percentage = calculatePercentage(daysPresent, totalDays);

     return {
      id: userData.map((user) => user.user_id).join(", "),
      name: userData.map((user) => user.username).join(", "),

      daysPresent,
      daysAbsent,
      daysLeave,
      percentage,
      state: determineState(percentage),
     };
    });

    setStudents(studentsData);
    
   } catch (error) {
    console.error("Error fetching data:", error);
   } finally {
    setLoading(false);
   }
  };
  fetchData();
 }, []);

 const calculatePercentage = (daysPresent, totalDays) => {
  return totalDays > 0 ? ((daysPresent / totalDays) * 100).toFixed(2) : "0.00";
 };

 const determineState = (percentage) => {
  if (percentage >= 95) {
   return "Outstanding";
  } else if (percentage >= 85 && percentage < 95) {
   return "Excellent";
  } else if (percentage >= 75 && percentage < 85) {
   return "Good";
  } else if (percentage >= 65 && percentage < 75) {
   return "Needs Improvement";
  } else {
   return "Warning";
  }
 };

 const handleSelectChange = (value) => {
  setSelectedStudent(value);
 };

 const handleGenerateReport = () => {
  if (selectedStudent) {
   const student = students.find((s) => s.id === selectedStudent);
   if (student) {
    setTableData([
     {
      key: student.id,
      studentName: student.name,
      daysPresent: student.daysPresent,
      daysAbsent: student.daysAbsent,
      daysLeave: student.daysLeave,
      percentage: student.percentage + "%",
      state: student.state,
     },
    ]);
   }
  }
 };

 const handleShowAllStudents = () => {
  const allData = students.map((student) => ({
   key: student.id,
   studentName: student.name,
   daysPresent: student.daysPresent,
   daysAbsent: student.daysAbsent,
   daysLeave: student.daysLeave,
   percentage: student.percentage + "%",
   state: student.state,
  }));
  setTableData(allData);
 };

 const sendReports = async () => {
  try {
   setloading(true);
   const response = await axios.post(
    "https://ams-theta-tawny.vercel.app/api/admin/sendReports",
    students
   );
   message.success(response.data.message);
  } catch (error) {
   if (error.response && error.response.data) {
    message.error(error.response.data.message);
   } else {
    message.error("An error occurred. Please try again!");
   }
  } finally {
   setloading(false);
  }
 };

 if (Loading)
  return (
   <Spin
    style={{ position: "fixed", top: "50%", bottom: "50%", left: "50%" }}
    spinning
    size="large"
   />
  );

 const columns = [
  {
   title: "Student Name",
   dataIndex: "studentName",
   key: "studentName",
  },
  {
   title: "Total Days Present",
   dataIndex: "daysPresent",
   key: "daysPresent",
  },
  {
   title: "Total Days Absent",
   dataIndex: "daysAbsent",
   key: "daysAbsent",
  },
  {
   title: "Total Days Leave",
   dataIndex: "daysLeave",
   key: "daysLeave",
  },
  {
   title: "Percentage",
   dataIndex: "percentage",
   key: "percentage",
   render: (text) => `${text}`, 
  },
  {
   title: "State",
   dataIndex: "state",
   key: "state",
  },
 ];

 return (
  <div style={{ padding: 24 }}>
   <div
    style={{
     display: "flex",
     flexDirection: "column",
     gap: 16,
     marginBottom: 16,
     alignItems: "flex-start",
    }}
   >
    <Select
     showSearch
     placeholder="Select Student"
     style={{ width: "100%", maxWidth: 300 }}
     onChange={handleSelectChange}
     loading={loading}
     optionFilterProp="children"
     filterOption={(input, option) =>
      option.children.toLowerCase().includes(input.toLowerCase())
     }
    >
     {students.map((student) => (
      <Option key={student.id} value={student.id}>
       {student.name}
      </Option>
     ))}
    </Select>

    <Button
     type="primary"
     style={{ alignSelf: "stretch", maxWidth: 200 }}
     onClick={handleGenerateReport}
     disabled={loading}
    >
     Generate Report
    </Button>
    <Button
     type="default"
     style={{ alignSelf: "stretch", maxWidth: 200 }}
     onClick={handleShowAllStudents}
     disabled={loading}
    >
     Show All Students
    </Button>
    <Button
     type="dashed"
     style={{ alignSelf: "stretch", maxWidth: 200 }}
     disabled={loading}
     onClick={sendReports}
    >
     Send Reports
    </Button>
   </div>
   <Table
    columns={columns}
    dataSource={tableData}
    style={{ marginTop: 24 }}
    pagination={{ pageSize: 5 }}
    scroll={{ x: "max-content" }}
    loading={loading}
   />
  </div>
 );
};

export default Reports;
