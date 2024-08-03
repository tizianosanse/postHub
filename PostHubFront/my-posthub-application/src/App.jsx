import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./component/Login";
import Home from "./component/Home";
import NavbarComponent from "./component/NavbarComponent";
import Logout from "./component/Logout";
import Register from "./component/Register";
import Profile from "./component/Profile";

const App = () => {
  const isLoggedIn = localStorage.getItem("token") !== null;

  return (
    <Router>
      {isLoggedIn && <NavbarComponent />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
