import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import NewUserModal from "./NewUserModal";
import UserEntry from "./UserEntry";
import admin from "../../Assets/admin.png";
import config from "../../../config";

export default function Admin({ accessLevel }) {
  const navigate = useNavigate();
  const [userListData, setUserListData] = useState([]);
  const [newUserModal, setNewUserModal] = useState(false);
  const [currentOpenUser, setCurrentOpenUser] = useState();

  useEffect(() => {
    if (accessLevel === "notLoggedIn") {
      navigate("/");
    }
  }, [accessLevel]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const res = await fetch(config.SERVER + "/api/admin/", {
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
      <div className="pageHeader">
        <img className="pageImage" src={admin} />
        <div className="pageTitle">User Panel</div>
      </div>
      <div style={{ width: "70%", margin: "0 auto", textAlign: "left" }}>
        {accessLevel === "admin" ? (
          <>
            <div
              className="function"
              onClick={() => {
                setNewUserModal(true);
              }}
            >
              Create New User
            </div>
            <div style={{ marginTop: "20px" }}>
              <div className="adminListArrowContainer " />
              <div className="adminListUser" style={{ fontSize: "28px" }}>
                User ID
              </div>
              <div className="adminListAccess" style={{ fontSize: "28px" }}>
                Access Level
              </div>
              <div className="separator" />
            </div>
            {userListData.map((userEntryData, userIndex) => (
              <UserEntry
                key={userEntryData._id}
                userEntryData={userEntryData}
                getUsers={getUsers}
                userIndex={userIndex}
                currentOpenUser={currentOpenUser}
                setCurrentOpenUser={setCurrentOpenUser}
              />
            ))}
          </>
        ) : accessLevel === "loading" ? (
          "Loading..."
        ) : (
          "Unauthorised access"
        )}
      </div>
      {newUserModal ? (
        <NewUserModal setNewUserModal={setNewUserModal} getUsers={getUsers} />
      ) : (
        ""
      )}
    </>
  );
}
