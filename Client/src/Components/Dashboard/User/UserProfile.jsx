import React, { useState } from "react";
import { Form, Input, Button, Upload, Avatar, message } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import useStore from "../../../createStore";
import axios from "axios";

const UserProfile = () => {
 const { user, setUser } = useStore();

 const { first_name, last_name, email, profile_image } = user;

 const [imageUrl, setImageUrl] = useState(user ? profile_image : null);
 const [isEditing, setIsEditing] = useState(false);
 const [imageBase64, setImageBase64] = useState(null);

 const onFinish = async (values) => {
  try {
   const response = await axios.put(
    `http://localhost:5002/api/users/updateProfile/${user.email}/`,
    {
     first_name: values.firstName,
     last_name: values.lastName,
     profile_image: imageBase64,
    }
   );
   setUser({
    ...user,
    first_name: values.firstName,
    last_name: values.lastName,
    profile_image: imageBase64,
   });
   message.success(response.data.message);

   setIsEditing(false);
  } catch (error) {
   setIsEditing(false);
   if (error.response && error.response.data.message) {
    message.error(error.response.data.message);
   } else {
    message.error("An unexpected error occurred");
   }
  }
 };

 const handleUpload = (info) => {
  const file = info.file.originFileObj || info.file;
  if (file) {
   getBase64(file, (url) => {
    setImageUrl(url);
    setImageBase64(url);
   });
  }
 };

 const getBase64 = (file, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(file);
 };

 return (
  <div
   style={{
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    flexDirection: "column",
   }}
  >
   <div
    style={{
     display: "flex",
     alignItems: "center",
     justifyContent: "center",
     flexDirection: "column",
    }}
   >
    <Avatar
     size={100}
     icon={<UserOutlined />}
     src={imageUrl}
     style={{ marginBottom: "20px" }}
    />

    <Upload
     showUploadList={false}
     beforeUpload={() => false}
     onChange={handleUpload}
     disabled={!isEditing}
    >
     <Button icon={<UploadOutlined />} disabled={!isEditing}>
      Upload Profile Picture
     </Button>
    </Upload>
   </div>
   <Form
    layout="vertical"
    onFinish={onFinish}
    initialValues={{ firstName: first_name, lastName: last_name, email: email }}
    style={{ marginTop: "20px" }}
   >
    <Form.Item
     label="First Name"
     name="firstName"
     rules={[{ required: true, message: "Please input your first name!" }]}
    >
     <Input placeholder="First Name" disabled={!isEditing} />
    </Form.Item>

    <Form.Item
     label="Last Name"
     name="lastName"
     rules={[{ required: true, message: "Please input your last name!" }]}
    >
     <Input placeholder="Last Name" disabled={!isEditing} />
    </Form.Item>

    <Form.Item
     label="Email"
     name="email"
     rules={[
      { required: true, message: "Please input your email!", type: "email" },
     ]}
    >
     <Input placeholder="Email" disabled={!isEditing} />
    </Form.Item>

    {isEditing ? (
     <Form.Item>
      <Button type="primary" htmlType="submit" block>
       Save Changes
      </Button>
     </Form.Item>
    ) : (
     <Button type="primary" block onClick={() => setIsEditing(true)}>
      Edit
     </Button>
    )}
   </Form>
  </div>
 );
};

export default UserProfile;
