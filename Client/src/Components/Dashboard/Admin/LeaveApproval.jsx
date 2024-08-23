import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal, message } from "antd";
import axios from "axios";

const LeaveApproval = () => {
 const [data, setData] = useState([]);

 useEffect(() => {
  const fetchPendingLeaves = async () => {
   try {
    const response = await axios.get(
     "https://ams-theta-tawny.vercel.app/api/admin/pendingLeaves"
    );
    // Log the data to understand the structure
    

    // Map the data correctly
    const formattedData = response.data.map((item) => ({
     key: item.leaveId,
     username: item.username,
     leaveDate: new Date(item.leaveDate).toLocaleDateString(), // Format the date
     reason: item.reason,
     status: item.status,
     userId: item.userId,
     leaveId: item.leaveId,
    }));

    setData(formattedData);
   } catch (error) {
    message.error("Failed to fetch leave requests");
   }
  };
  fetchPendingLeaves();
 }, []);

 const handleAction = (record, action) => {
  const status = action === "Approved" ? "approved" : "rejected";

  Modal.confirm({
   title: `${status === "approved" ? "Approve" : "Reject"} leave request for ${
    record.username
   }?`,
   onOk: async () => {
    try {
     await axios.post("https://ams-theta-tawny.vercel.app/api/admin/leaveApproval", {
      userId: record.userId,
      leaveId: record.leaveId,
      action: status,
     });

     setData((prevData) =>
      prevData.map((item) =>
       item.leaveId === record.leaveId ? { ...item, status: action } : item
      )
     );

     message.success(`Leave ${status} successfully`);
    } catch (error) {
     message.error(`Failed to ${status} leave`);
    }
   },
  });
 };

 const columns = [
  {
   title: "Username",
   dataIndex: "username",
   key: "username",
  },
  {
   title: "Leave Date",
   dataIndex: "leaveDate",
   key: "leaveDate",
  },
  {
   title: "Reason",
   dataIndex: "reason",
   key: "reason",
  },
  {
   title: "Status",
   dataIndex: "status",
   key: "status",
   render: (status) => <span>{status === "Pending" ? "Pending" : status}</span>,
  },
  {
   title: "Actions",
   key: "actions",
   render: (text, record) => (
    <Space size="middle">
     {record.status === "Pending" ? (
      <>
       <Button type="link" onClick={() => handleAction(record, "Approved")}>
        Approve
       </Button>
       <Button type="link" onClick={() => handleAction(record, "Rejected")}>
        Reject
       </Button>
      </>
     ) : (
      <span>{record.status}</span>
     )}
    </Space>
   ),
  },
 ];

 return (
  <div style={{ padding: 24, maxWidth: "100%" }}>
   <Table
    columns={columns}
    dataSource={data}
    pagination={{ pageSize: 5 }}
    scroll={{ x: "max-content" }}
   />
  </div>
 );
};

export default LeaveApproval;
