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
      <Route
       path="*"
       element={
        <div style={{ textAlign: "center", marginTop: "10rem" }}>
         <h1>404</h1>
         <p>Page Not Found</p>
        </div>
       }
      />
     </>
    )}
   </Routes>
  </Router>
 );
}

export default App;
