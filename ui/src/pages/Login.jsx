import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";

function Login() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <div className="content text-center px-4">
            <p className="content">
              If you don't have an account, please{" "}
              <Link to="/register/">register</Link>.
            </p>
          </div>
        </div>
        <div className="col-md-6 p-5">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;