import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./components/home/Home";
import Dashboard from "./components/moderator/Dashboard";

import Interview from "./components/interview/Interview";

import LoginForm from './components/auth/Login';

import RegisterForm from "./components/auth/Register";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard/" element={<Dashboard />} />
      <Route path="/interview/" element={<Interview />} />
      <Route path="/login/" element={<LoginForm />} />
      <Route path="/modregister/" element={<RegisterForm />} />
    </Routes>
  );
}

export default App;