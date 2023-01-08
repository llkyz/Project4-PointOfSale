import { useState } from "react";

export default function EditUserModal({
  setShowEditUserModal,
  userData,
  refreshList,
}) {
  const [errorMessage, setErrorMessage] = useState();

  async function doEditUser(event) {
    event.preventDefault();
    if (event.target.form[1].value !== event.target.form[2].value) {
      setErrorMessage("Passwords do not match");
      return;
    }

    let formBody = {
      username: event.target.form[0].value,
      password: event.target.form[1].value,
    };
    const res = await fetch(`/api/user/${userData._id}`, {
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
      setShowEditUserModal(false);
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
          setShowEditUserModal(false);
        }}
      />
      <div className="modal">
        <button
          onClick={() => {
            setShowEditUserModal(false);
          }}
        >
          Close
        </button>
        <h1>Edit User: {userData.username}</h1>
        {errorMessage ? <p>{errorMessage}</p> : ""}
        <form>
          <div>
            <label>User ID</label>
            <input type="text" defaultValue={userData.username} />
          </div>
          <div>
            <label>Change password</label>
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
                doEditUser(event);
              }}
            />
          </div>
        </form>
      </div>
    </>
  );
}
