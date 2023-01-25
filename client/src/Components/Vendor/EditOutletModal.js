import { useState } from "react";
import config from "../../../config";

export default function EditOutletModal({
  setShowEditOutletModal,
  userData,
  getOutletList,
}) {
  const [errorMessage, setErrorMessage] = useState();

  async function doEditOutlet(event) {
    event.preventDefault();
    if (event.target.form[1].value !== event.target.form[2].value) {
      setErrorMessage("Passwords do not match");
      return;
    }

    let formBody = {
      username: event.target.form[0].value,
      password: event.target.form[1].value,
    };
    const res = await fetch(config.SERVER + `/api/user/${userData._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
    });
    let result = await res.json();
    if (res.ok) {
      console.log(result.data);
      setShowEditOutletModal(false);
      getOutletList();
    } else {
      setErrorMessage(result.data);
    }
  }

  return (
    <>
      <div
        className="modalBackground"
        onClick={() => {
          setShowEditOutletModal(false);
        }}
      />
      <div className="modal">
        <div className="container">
          <div
            className="modalClose"
            onClick={() => {
              setShowEditOutletModal(false);
            }}
          >
            x
          </div>
          <h1>Editing Outlet: {userData.username}</h1>
          <div className="separator" />
          {errorMessage ? (
            <div className="error" style={{ marginTop: "20px" }}>
              {errorMessage}
            </div>
          ) : (
            ""
          )}
          <form style={{ width: "70%", margin: "0 auto", textAlign: "left" }}>
            <div style={{ marginTop: "20px" }}>
              <div>User ID</div>
              <input
                className="modalInput"
                type="text"
                defaultValue={userData.username}
              />
            </div>
            <div style={{ marginTop: "20px" }}>
              <div>Change password</div>
              <input className="modalInput" type="password" />
            </div>
            <div>
              <div>Re-enter Password</div>
              <input className="modalInput" type="password" />
            </div>
            <div style={{ marginTop: "50px" }}>
              <input
                className="modalSubmit"
                type="submit"
                value="Submit"
                onClick={(event) => {
                  doEditOutlet(event);
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
