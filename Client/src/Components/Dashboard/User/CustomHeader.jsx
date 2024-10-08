import { Avatar, Flex, Typography } from "antd";
import { MessageOutlined, UserOutlined } from "@ant-design/icons";

import React from "react";
import useStore from "../../../createStore";

const CustomHeader = () => {
 const { user } = useStore();
 const name = user?.isAdmin ? "User" : user?.last_name || "Guest";
 return (
  <Flex align="center" justify="space-between">
   <></>
   <Typography.Title level={4} type="secondary" style={{ color: "white" }}>
    Welcome Back {name}
   </Typography.Title>
   <Flex align="flex-end">
    {user?.profile_image === "" ? (
     <Avatar icon={<UserOutlined color="white" />} size="large" />
    ) : (
     <Avatar
      src={user?.profile_image}
      style={{ borderWidth: 1, borderColor: "wheat" }}
      size="large"
     />
    )}
   </Flex>
  </Flex>
 );
};

export default CustomHeader;
