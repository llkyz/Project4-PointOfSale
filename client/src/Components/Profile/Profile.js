import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

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
      <h1>Profile Page</h1>
      {profileData ? (
        <>
          <h2>User ID: {profileData.username}</h2>
          <h2>User Type: {profileData.accessLevel}</h2>
          <div>
            <h2>Edit Profile</h2>
            {errorMessage ? <h3>{errorMessage}</h3> : ""}
            <form>
              <div>
                <label>User ID</label>
                <input type="text" defaultValue={profileData.username} />
              </div>
              <div>
                <label>New Password</label>
                <input type="password" />
              </div>
              <div>
                <label>Re-enter Password</label>
                <input type="password" />
              </div>
              <div>
                <input
                  type="submit"
                  value="Submit"
                  onClick={(event) => {
                    updateProfile(event);
                  }}
                />
              </div>
            </form>
          </div>
          <button onClick={doLogout}>Log Out</button>
        </>
      ) : (
        "Loading..."
      )}
    </>
  );
}
