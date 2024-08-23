import { Flex, Menu, theme } from "antd";
import React from "react";
import {
 UserOutlined,
 ProfileOutlined,
 LogoutOutlined,
 OrderedListOutlined,
 CarryOutOutlined,
 FileAddOutlined,
 SignatureOutlined,
 InsuranceOutlined,
 BookOutlined,
} from "@ant-design/icons";
import { FaLeaf } from "react-icons/fa6";
import { useMediaQuery, useTheme } from "@mui/material";
import {
 ApprovalOutlined,
 GradingOutlined,
 NotificationsActiveOutlined,
} from "@mui/icons-material";
import logo from "../../../assets/layout.png";

const SidebarAdmin = ({ setSelectedMenuItem }) => {
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
       label: "Dashboard",
      },
      {
       key: "3",
       icon: <FileAddOutlined />,
       label: "Reports",
      },

      {
       key: "4",
       icon: <ApprovalOutlined />,
       label: "Leave Approval",
      },
      {
       key: "5",
       icon: <GradingOutlined />,
       label: "Grading System",
      },
      {
       key: "6",
       icon: <LogoutOutlined />,
       label: "Logout",
      },
     ]}
    />
   </Flex>
  </>
 );
};

export default SidebarAdmin;
