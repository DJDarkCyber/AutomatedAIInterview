import React from "react";
import { Link } from "react-router-dom";
import RegistrationForm from "../components/auth/RegistrationForm";


function Registration() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <div className="content text-center px-4">
            <p className="content">
              If you already have an account, please{" "}
              <Link to="/login/">login</Link>.
            </p>
          </div>
        </div>
        <div className="col-md-6 p-5">
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
}

export default Registration;