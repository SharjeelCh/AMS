import { Flex, Menu } from "antd";
import React from "react";
import {
 UserOutlined,
 CarryOutOutlined,
 InsuranceOutlined,
 LogoutOutlined,
} from "@ant-design/icons";
import { useMediaQuery, useTheme } from "@mui/material";
import { NotificationsActiveOutlined } from "@mui/icons-material";
import logo from "../../../assets/layout.png";
const Sidebar = ({ setSelectedMenuItem }) => {
 const theme = useTheme();
 const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

 return (
  <>
   <Flex align="center" justify="center" className="side">
    <div className="logoo">
     <img src={logo} alt="AMS Logo" style={{ width: "40px", height: "40px" }} />
    </div>
    <Menu
     defaultSelectedKeys={["1"]}
     className="menu-bar"
     onClick={({ key }) => setSelectedMenuItem(key)}
     items={[
      {
       key: "1",
       icon: <UserOutlined />,
       label: "Profile",
      },
      {
       key: "2",
       icon: <CarryOutOutlined />,
       label: "Mark Attendance",
      },
      {
       key: "3",
       icon: <InsuranceOutlined />,
       label: "Attendance Record",
      },
      {
       key: "4",
       icon: <NotificationsActiveOutlined />,
       label: "Notifications",
      },
      {
       key: "5",
       icon: <LogoutOutlined />,
       label: "Logout",
      },
     ]}
    />
   </Flex>
  </>
 );
};

export default Sidebar;
