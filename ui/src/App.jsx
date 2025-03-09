import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./components/home/Home";
import Registration from "./pages/Registration";
import Login from "./pages/Login";

import Dashboard from "./components/moderator/Dashboard";

import Interview from "./components/interview/Interview";

import LoginForm from './components/auth/Login';


function App() {
  return (
    <Routes>
      <Route
        path="/fafdsfds"
        element={
          <ProtectedRoute>
            {/* <Home /> */}
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Home />} />
      <Route path="/register/" element={<Registration />} />
      <Route path="/dashboard/" element={<Dashboard />} />
      <Route path="/interview/" element={<Interview />} />
      <Route path="/login/" element={<LoginForm />} />
    </Routes>
  );
}

export default App;