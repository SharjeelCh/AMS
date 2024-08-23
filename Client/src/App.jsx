import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./Screens/Login";
import SignUp from "./Screens/SignUp";
import Dashboard from "./Screens/Dashboard";
import AdminLogin from "./Screens/AdminLogin";
import AdminDashboard from "./Screens/AdminDashboard";
import useStore from "./createStore";

function App() {
 const { user } = useStore();

 console.log("User:", user); // Debugging user state

 return (
  <Router>
   <Routes>
    {user && user.isAdmin ? (
     <Route index element={<AdminDashboard />} />
    ) : (
     <Route index element={<Dashboard />} />
    )}

    {!user && (
     <>
      <Route path="/AdminLogin" element={<AdminLogin />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />
     </>
    )}
    <Route path="*" element={<Login />} />
   </Routes>
  </Router>
 );
}

export default App;
