import { Button, Layout, Menu } from "antd";
import React, { useState } from "react";
import CustomHeader from "../Components/Dashboard/Admin/CustomHeader";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import "../Styles/Appp.css";
import MainContent from "../Components/Dashboard/User/MainContent";

import { useMediaQuery, useTheme } from "@mui/material";

import SidebarAdmin from "../Components/Dashboard/Admin/SidebarAdmin";
import Dashboard from "../Components/Dashboard/Admin/Dashboard";
import Reports from "../Components/Dashboard/Admin/Reports";
import LeaveApproval from "../Components/Dashboard/Admin/LeaveApproval";
import GradingSystem from "../Components/Dashboard/Admin/Grading";
import Logout from "../Components/Dashboard/User/Logout";
import UserProfile from "../Components/Dashboard/User/UserProfile";

const { Sider, Header, Content } = Layout;

const AdminDashboard = () => {
 const [collapsed, setCollapsed] = useState(false);
 const [selectedMenuItem, setSelectedMenuItem] = useState("1");
 const theme = useTheme();
 const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

 const renderContent = () => {
  switch (selectedMenuItem) {
   case "1":
    return <Dashboard />;
   
   case "3":
    return <Reports />;
   case "4":
    return <LeaveApproval />;
   case "5":
    return <GradingSystem />;
    case "6":
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
    <SidebarAdmin setSelectedMenuItem={setSelectedMenuItem} />
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

export default AdminDashboard;
