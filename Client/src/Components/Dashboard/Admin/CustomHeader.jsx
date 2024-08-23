import { Avatar, Flex, Typography } from "antd";
import { MessageOutlined, UserOutlined } from "@ant-design/icons";
import useStore from "../../../createStore";
import React from "react";

const CustomHeader = () => {
 const { user } = useStore();
 const name = user?.isAdmin ? user.name : user?.last_name || "Guest";
 return (
  <Flex align="center" justify="space-between">
   <></>
   <Typography.Title level={4} type="secondary" style={{ color: "white" }}>
    Welcome Back {name}
   </Typography.Title>
   <Flex align="flex-end">
    <Avatar icon={<UserOutlined color="white" />} size="large" />
   </Flex>
  </Flex>
 );
};

export default CustomHeader;
