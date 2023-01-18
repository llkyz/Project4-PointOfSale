import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import profile from "../Assets/profile.png";

export default function Profile({ accessLevel, setAccessLevel }) {
  const [profileData, setProfileData] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    getProfileData();
  }, []);

  async function getProfileData() {
    const res = await fetch("/api/user/profile", {
      method: "GET",
      credentials: "include",
    });
    let result = await res.json();
    if (res.ok) {
      setProfileData(result.data);
    } else {
      setErrorMessage(result.data);
    }
  }

  async function updateProfile(event) {
    event.preventDefault();
    if (event.target.form[1].value !== event.target.form[2].value) {
      setErrorMessage("Passwords do not match");
      return;
    }

    let formBody = {
      username: event.target.form[0].value,
      password: event.target.form[1].value,
    };
    const res = await fetch(`/api/user/${profileData._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
    });
    let result = await res.json();
    if (res.ok) {
      getProfileData();
      setErrorMessage("Profile successfully edited");
      event.target.form[0].value = "";
      event.target.form[1].value = "";
      event.target.form[2].value = "";
    } else {
      setErrorMessage(result.data);
    }
  }

  function doLogout() {
    Cookies.remove("token");
    setAccessLevel("notLoggedIn");
    navigate("/");
  }

  return (
    <>
      <div className="pageHeader">
        <img src={profile} className="pageImage" />
        <div className="pageTitle">Profile</div>
      </div>
      {profileData ? (
        <div style={{ width: "50%", margin: "0 auto" }}>
          <div className="header">I N F O R M A T I O N</div>
          <div className="separator" />
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div style={{ textAlign: "left", display: "inline-block" }}>
              <h1>User ID</h1>
              <h2>{profileData.username}</h2>
            </div>
            <div style={{ textAlign: "left", display: "inline-block" }}>
              <h1>Access Type</h1>
              <h2>{profileData.accessLevel}</h2>
            </div>
          </div>
          <div>
            <div className="header" style={{ marginTop: "30px" }}>
              E D I T
            </div>
            <div className="separator" />
            {errorMessage ? (
              <div className="error" style={{ marginTop: "20px" }}>
                {errorMessage}
              </div>
            ) : (
              ""
            )}
            <form
              style={{
                width: "300px",
                margin: "0 auto",
                marginTop: "30px",
                textAlign: "left",
              }}
            >
              <div>
                <div>User ID</div>
                <input
                  className="loginInput"
                  type="text"
                  defaultValue={profileData.username}
                />
              </div>
              <div>
                <div>New Password</div>
                <input className="loginInput" type="password" />
              </div>
              <div>
                <div>Re-enter Password</div>
                <input className="loginInput" type="password" />
              </div>
              <div>
                <input
                  className="loginButton"
                  type="submit"
                  value="Submit"
                  onClick={(event) => {
                    updateProfile(event);
                  }}
                />
              </div>
            </form>
          </div>
          <div
            className="logoutLink"
            style={{ marginTop: "50px" }}
            onClick={doLogout}
          >
            Log Out
          </div>
        </div>
      ) : (
        "Loading..."
      )}
    </>
  );
}
