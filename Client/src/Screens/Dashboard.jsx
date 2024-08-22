import { Button, Layout, Menu } from "antd";
import React, { useState } from "react";
import Sidebar from "../Components/Dashboard/User/Sidebar";
import CustomHeader from "../Components/Dashboard/User/CustomHeader";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import "../Styles/Appp.css";
import MainContent from "../Components/Dashboard/User/MainContent";

import { useMediaQuery, useTheme } from "@mui/material";
import AttendanceRecord from "../Components/Dashboard/User/AttendanceRecord";
import AttendancePage from "../Components/Dashboard/User/AttendancePage";
import UserProfile from "../Components/Dashboard/User/UserProfile";
import Notification from "../Components/Dashboard/User/Notification";
import Logout from "../Components/Dashboard/User/Logout";

const { Sider, Header, Content } = Layout;

const Dashboard = () => {
 const [collapsed, setCollapsed] = useState(false);
 const [selectedMenuItem, setSelectedMenuItem] = useState("1");
 const theme = useTheme();
 const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

 const renderContent = () => {
  switch (selectedMenuItem) {
   case "1":
    return <UserProfile />;
   case "2":
    return <AttendancePage />;
   case "3":
    return <AttendanceRecord />;
   case "4":
    return <Notification />;
   case "5":
    return <Logout />;

   default:
    return <UserProfile />;
  }
 };

 return (
  <Layout>
   <Sider
    theme="dark"
    trigger={null}
    collapsible
    collapsed={isMobile ? true : collapsed}
    className="sider"
   >
    <Sidebar setSelectedMenuItem={setSelectedMenuItem} />
    <Button
     type="text"
     icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
     onClick={() => {
      if (!isMobile) setCollapsed(!collapsed);
     }}
     className="trigger-btn"
    />
   </Sider>
   <Layout>
    <Header className="headerr">
     <CustomHeader />
    </Header>
    <Content className="content">{renderContent()}</Content>
   </Layout>
  </Layout>
 );
};

export default Dashboard;
