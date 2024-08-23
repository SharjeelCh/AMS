import React from "react";

import { Button, Checkbox, Form, Grid, Input, theme, Typography } from "antd";
import { message } from "antd";

import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useStore from "../createStore";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

export default function Login() {
 const { token } = useToken();
 const navigate = useNavigate();
 const screens = useBreakpoint();
 const { user, setUser } = useStore();

 const onFinish = async (values) => {
  try {
   const response = await axios.post(`https://ams-omega.vercel.app/api/users/Login/`, {
    email: values.email,
    password: values.password,
   });
   setUser({
    user_id: response.data.data._id,
    first_name: response.data.data.first_name,
    last_name: response.data.data.last_name,
    email: values.email,
    isAdmin: false,
    profile_image: response.data.data.profileImage,
   });
   message.success("Login Successful");
   navigate("/");
  } catch (error) {
   if (error.response && error.response.data.message) {
    message.error(error.response.data.message);
   } else {
    message.error("An unexpected error occurred");
   }
  }
 };

 const styles = {
  container: {
   margin: "0 auto",
   padding: screens.md
    ? `${token.paddingXL}px`
    : `${token.sizeXXL}px ${token.padding}px`,
   width: "380px",
  },
  footer: {
   marginTop: token.marginLG,
   textAlign: "center",
   width: "100%",
  },
  forgotPassword: {
   float: "right",
  },
  header: {
   marginBottom: token.marginXL,
  },
  section: {
   alignItems: "center",
   backgroundColor: token.colorBgContainer,
   display: "flex",
   height: screens.sm ? "100vh" : "auto",
   padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
  },
  text: {
   color: token.colorTextSecondary,
  },
  title: {
   fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
  },
 };

 return (
  <section style={styles.section}>
   <div style={styles.container}>
    <div style={styles.header}>
     <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
     >
      <rect x="0.464294" width="24" height="24" rx="4.8" fill="#1890FF" />
      <path d="M14.8643 3.6001H20.8643V9.6001H14.8643V3.6001Z" fill="white" />
      <path d="M10.0643 9.6001H14.8643V14.4001H10.0643V9.6001Z" fill="white" />
      <path
       d="M4.06427 13.2001H11.2643V20.4001H4.06427V13.2001Z"
       fill="white"
      />
     </svg>

     <Title style={styles.title}>Sign in</Title>
     <Text style={styles.text}>
      Welcome back to AMS! Please enter your details below to sign in.
     </Text>
    </div>
    <Form
     name="normal_login"
     initialValues={{
      remember: true,
     }}
     onFinish={onFinish}
     layout="vertical"
     requiredMark="optional"
    >
     <Form.Item
      name="email"
      rules={[
       {
        type: "email",
        required: true,
        message: "Please input your Email!",
       },
      ]}
     >
      <Input prefix={<MailOutlined />} placeholder="Email" />
     </Form.Item>
     <Form.Item
      name="password"
      rules={[
       {
        required: true,
        message: "Please input your Password!",
       },
      ]}
     >
      <Input.Password
       prefix={<LockOutlined />}
       type="password"
       placeholder="Password"
      />
     </Form.Item>
     <Form.Item>
      <Form.Item name="remember" valuePropName="checked" noStyle>
       <Checkbox>Remember me</Checkbox>
      </Form.Item>
     </Form.Item>
     <Form.Item style={{ marginBottom: "0px" }}>
      <Button block="true" type="primary" htmlType="submit">
       Log in
      </Button>
      <div style={styles.footer}>
       <Text style={styles.text}>Don't have an account?</Text>{" "}
       <Link to={"/SignUp"}>Sign up now</Link>
       <Link style={styles.forgotPassword} to={"/AdminLogin"}>
        Admin?
       </Link>
      </div>
     </Form.Item>
    </Form>
   </div>
  </section>
 );
}
