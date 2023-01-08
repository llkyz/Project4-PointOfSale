import { useState } from "react";

export default function DeleteUserModal({
  setShowDeleteUserModal,
  userData,
  refreshList,
}) {
  const [errorMessage, setErrorMessage] = useState();

  async function doDeleteUser() {
    const res = await fetch(`/api/user/${userData._id}`, {
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
        <h1>Delete this user?</h1>
        {errorMessage ? <h2>{errorMessage}</h2> : ""}
        <button onClick={doDeleteUser}>Confirm</button>
        <button
          onClick={() => {
            setShowDeleteUserModal(false);
          }}
        >
          Cancel
        </button>
      </div>
    </>
  );
}
