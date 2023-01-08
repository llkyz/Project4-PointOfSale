import React from "react";

export default function Home({ accessLevel }) {
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
