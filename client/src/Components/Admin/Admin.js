import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AdminBar from "./AdminBar";
import UserList from "./UserList";

export default function Admin({ accessLevel }) {
  const navigate = useNavigate();
  const [userListData, setUserListData] = useState([]);

  useEffect(() => {
    if (accessLevel === "notLoggedIn") {
      navigate("/");
    }
  }, [accessLevel]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const res = await fetch("/api/admin/", {
      method: "GET",
      credentials: "include",
    });
    let result = await res.json();
    if (res.ok) {
      setUserListData(result.data);
    } else {
      console.log(result.data);
    }
  }

  return (
    <>
      <h1>Admin User Panel</h1>
      {accessLevel === "admin" ? (
        <>
          <AdminBar getUsers={getUsers} />
          <UserList userListData={userListData} getUsers={getUsers} />
        </>
      ) : accessLevel === "loading" ? (
        "Loading..."
      ) : (
        "Unauthorised access"
      )}
    </>
  );
}
