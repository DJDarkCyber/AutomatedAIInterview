import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useUserActions } from "../../hooks/user.actions";
import AuthHeader from "./Header";

function LoginForm() {

  document.title = "AI Interview | Home"

  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const userActions = useUserActions();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loginForm = event.currentTarget;

    if (loginForm.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setLoading(true);

    const data = {
      email: form.username,
      password: form.password,
    };

    try {
      await userActions.login(data);
      setError(null);
    } catch (err) {
      if (err.message) {
        setError(err.request.response || "An error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AuthHeader />
      <main className="flex flex-col items-center justify-center mt-20">
    <Form
      id="registration-form"
      className="border p-6 rounded-lg shadow-sm bg-white max-w-md mx-auto"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
        Login
      </h2>

      <Form.Group className="mb-4">
        <Form.Label className="text-gray-700">Username</Form.Label>
        <Form.Control
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          type="text"
          placeholder="Enter your username"
          className="rounded-lg"
        />
        <Form.Control.Feedback type="invalid">
          Please enter a valid username.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="text-gray-700">Password</Form.Label>
        <Form.Control
          value={form.password}
          minLength="8"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          type="password"
          placeholder="Enter your password"
          className="rounded-lg"
        />
        <Form.Control.Feedback type="invalid">
          Password must be at least 8 characters long.
        </Form.Control.Feedback>
      </Form.Group>

      {error && (
        <div className="mb-4 text-center text-sm text-red-600">
          {typeof error === "string" ? error : "An error occurred during login."}
        </div>
      )}

      <Button
        variant="primary"
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
      >
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="mr-2"
            />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </Button>
    </Form>
    </main>
    </div>
  );
}

export default LoginForm;