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
import { NotificationsActiveOutlined } from "@mui/icons-material";

const SidebarAdmin = ({ setSelectedMenuItem }) => {
 const theme = useTheme();
 const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

 return (
  <>
   <Flex align="center" justify="center" className="side">
    <div className="logoo">
     <FaLeaf />
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
       icon: <InsuranceOutlined />,
       label: "Reports",
      },

      {
       key: "4",
       icon: <NotificationsActiveOutlined />,
       label: "Leave Approval",
      },
      {
        key: "5",
        icon: <NotificationsActiveOutlined />,
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
