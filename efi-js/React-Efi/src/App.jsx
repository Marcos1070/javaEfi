import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/Home.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import Posts from "./components/Posts/Posts.jsx";
import Reviews from "./components/Reviews/Reviews.jsx";


import Navbar from "./components/Navbar.jsx";  
import { useAuth } from "./context/AuthContext.jsx";

import "./App.css";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const { user } = useAuth();

  return (
    <div className="App">

      {/*navbar solo cuando hay usuario logueado */}
      {user && <Navbar />}

      <Routes>
        {/* Redirección inicial */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Públicas */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Privadas */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/posts"
          element={
            <PrivateRoute>
              <Posts />
            </PrivateRoute>
          }
        />

        <Route
          path="/reviews"
          element={
            <PrivateRoute>
              <Reviews />
            </PrivateRoute>
          }
        />

      </Routes>
    </div>
  );
}







