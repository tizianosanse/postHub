import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./component/Login";
import Home from "./component/Home";
import NavbarComponent from "./component/NavbarComponent";
import Logout from "./component/Logout";
import Register from "./component/Register";
import Profile from "./component/Profile";
import UserProfile from "./component/UserProfile";
import Footer from "./component/Footer";

const App = () => {
  const isLoggedIn = localStorage.getItem("token") !== null;
  const isRegisterPage = location.pathname === "/register";

  return (
    <Router>
      <div className="app-container">
        {isLoggedIn && <NavbarComponent />}
        <main className="content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user/:userId" element={<UserProfile />} />
          </Routes>
        </main>
        {!isRegisterPage && <Footer />}
      </div>
    </Router>
  );
};

export default App;
