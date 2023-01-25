import { useState } from "react";
import config from "../../../config";

export default function DeleteUserModal({
  setShowDeleteUserModal,
  userData,
  refreshList,
}) {
  const [errorMessage, setErrorMessage] = useState();

  async function doDeleteUser() {
    const res = await fetch(config.SERVER + `/api/user/${userData._id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let result = await res.json();
    if (res.ok) {
      console.log(result.data);
      setShowDeleteUserModal(false);
      refreshList();
    } else {
      setErrorMessage(result.data);
    }
  }

  return (
    <>
      <div
        className="modalBackground"
        onClick={() => {
          setShowDeleteUserModal(false);
        }}
      />
      <div className="modal">
        <div className="container">
          <div
            className="modalClose"
            onClick={() => {
              setShowDeleteUserModal(false);
            }}
          >
            x
          </div>
          <h1 style={{ textAlign: "center" }}>Delete this user?</h1>
          {errorMessage ? <h2>{errorMessage}</h2> : ""}
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div className="functionSmall" onClick={doDeleteUser}>
              Confirm
            </div>
            <div
              className="functionSmall"
              onClick={() => {
                setShowDeleteUserModal(false);
              }}
            >
              Cancel
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
