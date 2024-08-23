import React from "react";
import {
 Button,
 Checkbox,
 Form,
 Grid,
 Input,
 message,
 theme,
 Typography,
} from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

export default function SignUp() {
 const { token } = useToken();
 const screens = useBreakpoint();

 const navigate = useNavigate();

 const onFinish = async (values) => {
  try {
   const response = await axios.post(
    "http://localhost:5002/api/users/signup/",
    {
     first_name: values.first_name,
     last_name: values.last_name,
     email: values.email,
     password: values.password,
    }
   );
   console.log(response.data);

   message.success("Verification email sent! Please check your inbox.");

   navigate("/Login");
  } catch (error) {
   if (error.response && error.response.data.message) {
    message.error(error.response.data.message);
   } else {
    message.error(error.message);
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

     <Title style={styles.title}>Sign up</Title>
     <Text style={styles.text}>
      Join AntBlocks UI! Please fill in your details below to create an account.
     </Text>
    </div>
    <Form
     name="signup_form"
     initialValues={{
      remember: true,
     }}
     onFinish={onFinish}
     layout="vertical"
     requiredMark="optional"
    >
     {/* Form Items */}
     <Form.Item
      name="first_name"
      rules={[
       {
        required: true,
        message: "Please input your First Name!",
       },
      ]}
     >
      <Input prefix={<UserOutlined />} placeholder="First Name" />
     </Form.Item>

     <Form.Item
      name="last_name"
      rules={[
       {
        required: true,
        message: "Please input your Last Name!",
       },
      ]}
     >
      <Input prefix={<UserOutlined />} placeholder="Last Name" />
     </Form.Item>

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

     <Form.Item
      name="confirm_password"
      dependencies={["password"]}
      hasFeedback
      rules={[
       {
        required: true,
        message: "Please confirm your Password!",
       },
       ({ getFieldValue }) => ({
        validator(_, value) {
         if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
         }
         return Promise.reject(new Error("The two passwords do not match!"));
        },
       }),
      ]}
     >
      <Input.Password
       prefix={<LockOutlined />}
       type="password"
       placeholder="Confirm Password"
      />
     </Form.Item>

     <Form.Item>
      <Form.Item name="remember" valuePropName="checked" noStyle>
       <Checkbox>I agree to the Terms and Conditions</Checkbox>
      </Form.Item>
     </Form.Item>

     <Form.Item style={{ marginBottom: "0px" }}>
      <Button block type="primary" htmlType="submit">
       Sign up
      </Button>
      <div style={styles.footer}>
       <Text style={styles.text}>Already have an account?</Text>{" "}
       <Link to={"/Login"}>Log in</Link>
      </div>
     </Form.Item>
    </Form>
   </div>
  </section>
 );
}
