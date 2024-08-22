import React, { useEffect, useState } from "react";
import useStore from "../../../createStore";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";

const Logout = () => {
 const { user, logout } = useStore();
 const nav = useNavigate();
 const [loading, setLoading] = useState(true);
 useEffect(() => {
  const handleLogout = () => {
   logout();
  };
  setTimeout(() => {
   setLoading(false);
   nav(user && user.isAdmin ? "/AdminLogin" : "/Login");
   handleLogout();
  }, 1000);
 });

 if (loading)
  return (
   <Spin
    style={{ position: "fixed", top: "50%", bottom: "50%", left: "50%" }}
    spinning
    size="large"
   />
  );

 return <></>;
};

export default Logout;
