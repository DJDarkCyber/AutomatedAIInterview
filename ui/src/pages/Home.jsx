import React, { useEffect } from "react";
import { getUser, useUserActions } from "../hooks/user.actions";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

function Home() {
  const user = getUser();
  const navigate = useNavigate();
  const userActions = useUserActions();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  if (!user) {
    return <div>Loading!</div>;
  }

  return (
    <div>
      <h1>Welcome!!</h1>
      <p>You've logged in as {user.username}</p>
      <Button type="button" onClick={userActions.logout}>Logout</Button>
    </div>
  );
}

export default Home;