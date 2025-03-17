import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "../components/Navigation";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Chat from "../pages/Chat";
import { useSelector } from "react-redux";

function Router() {
  const user = useSelector((state) => state.userReducer);

  console.log("User from router", user);
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        {!user.isLoggedIn && (
          <>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </>
        )}
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
