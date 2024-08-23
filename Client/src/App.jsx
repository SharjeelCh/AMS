import "./App.css";
import {
 Route,
 BrowserRouter as Router,
 Routes,
 Navigate,
} from "react-router-dom";
import Login from "./Screens/Login";
import SignUp from "./Screens/SignUp";
import Dashboard from "./Screens/Dashboard";
import AdminLogin from "./Screens/AdminLogin";
import AdminDashboard from "./Screens/AdminDashboard";
import useStore from "./createStore";

function App() {
 const { user } = useStore();

 return (
  <Router>
   <Routes>
    {user && user.isAdmin ? (
     <Route path="/" element={<AdminDashboard />} />
    ) : user ? (
     <Route path="/" element={<Dashboard />} />
    ) : (
     <>
      <Route path="/AdminLogin" element={<AdminLogin />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/Login" />} />
     </>
    )}
   </Routes>
  </Router>
 );
}

export default App;
