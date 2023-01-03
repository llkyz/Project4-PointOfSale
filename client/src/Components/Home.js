import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home({ accessLevel }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (accessLevel === "outlet") {
      navigate("/outlet");
    } else if (accessLevel === "admin") {
      navigate("/admin");
    }
  }, [accessLevel]);

  return (
    <>
      <h1>Home Page</h1>
      {accessLevel === "loading" ? (
        <h2>Loading...</h2>
      ) : accessLevel === "notLoggedIn" ? (
        <h2>Please Login</h2>
      ) : (
        <h2>Welcome back! You are a {accessLevel}</h2>
      )}
    </>
  );
}
