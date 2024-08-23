import React, { useState, useEffect } from "react";
import {
 Table,
 Button,
 Space,
 Modal,
 Form,
 Input,
 Row,
 Col,
 message,
} from "antd";
import axios from "axios";

const GradingSystem = () => {
 const [data, setData] = useState([]);
 const [isModalVisible, setIsModalVisible] = useState(false);
 const [editingRecord, setEditingRecord] = useState(null);
 const [form] = Form.useForm();

 const baseUrl = "https://ams-exvhbfycy-sharjeel-fida-chs-projects.vercel.app/api/admin";

 useEffect(() => {
  fetchGradingCriteria();
 }, []);

 const fetchGradingCriteria = async () => {
  try {
   const response = await axios.get(`${baseUrl}/getGradingCriteria`);
   setData(response.data);
  } catch (error) {
   message.error("Failed to fetch grading criteria");
  }
 };

 const handleAdd = () => {
  form.resetFields();
  setEditingRecord(null);
  setIsModalVisible(true);
 };

 const handleEdit = (record) => {
  form.setFieldsValue(record);
  setEditingRecord(record);
  setIsModalVisible(true);
 };

 const handleDelete = async (key) => {
  try {
   await axios.delete(`${baseUrl}/deleteGradingCriteria/${key}`);
   setData(data.filter((item) => item._id !== key));
   message.success("Grading criteria deleted successfully");
  } catch (error) {
   message.error("Failed to delete grading criteria");
  }
 };

 const handleModalOk = () => {
  form.validateFields().then(async (values) => {
   try {
    if (editingRecord) {
     // Update existing record
     const updatedRecord = { ...editingRecord, ...values };
     await axios.post(`${baseUrl}/addOrUpdateGradingCriteria`, {
      ...updatedRecord,
      id: editingRecord._id,
     });
     setData(
      data.map((item) =>
       item._id === editingRecord._id ? updatedRecord : item
      )
     );
     message.success("Grading criteria updated successfully");
    } else {
     const response = await axios.post(
      `${baseUrl}/addOrUpdateGradingCriteria`,
      values
     );
     setData([...data, response.data]);
     message.success("Grading criteria added successfully");
    }
    setIsModalVisible(false);
   } catch (error) {
    console.error("Error saving grading criteria:", error);
    message.error("Failed to save grading criteria");
   }
  });
 };

 const handleModalCancel = () => {
  setIsModalVisible(false);
 };

 const columns = [
  {
   title: "Attendance Threshold",
   dataIndex: "threshold",
   key: "threshold",
   responsive: ["md"], // Only show on medium screens and above
  },
  {
   title: "Grade",
   dataIndex: "grade",
   key: "grade",
  },
  {
   title: "Actions",
   key: "actions",
   render: (text, record) => (
    <Space size="middle">
     <Button type="link" onClick={() => handleEdit(record)}>
      Edit
     </Button>
     <Button type="link" onClick={() => handleDelete(record._id)}>
      Delete
     </Button>
    </Space>
   ),
  },
 ];

 return (
  <div style={{ padding: 24 }}>
   <Row justify="center">
    <Col xs={24} md={20} lg={16}>
     <Button
      type="primary"
      style={{ marginBottom: 16, width: "100%" }} // Full width on small screens
      onClick={handleAdd}
     >
      Add Grading Criteria
     </Button>
     <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 5 }}
      scroll={{ x: "100%" }} // Enable horizontal scrolling if needed
      rowKey="_id" // Ensure unique key for each row
     />
    </Col>
   </Row>

   <Modal
    title={editingRecord ? "Edit Grading Criteria" : "Add Grading Criteria"}
    visible={isModalVisible}
    onOk={handleModalOk}
    onCancel={handleModalCancel}
    okText={editingRecord ? "Save" : "Add"}
   >
    <Form form={form} layout="vertical">
     <Form.Item
      name="threshold"
      label="Attendance Threshold"
      rules={[
       { required: true, message: "Please input the attendance threshold!" },
      ]}
     >
      <Input />
     </Form.Item>
     <Form.Item
      name="grade"
      label="Grade"
      rules={[{ required: true, message: "Please input the grade!" }]}
     >
      <Input />
     </Form.Item>
    </Form>
   </Modal>
  </div>
 );
};

export default GradingSystem;
