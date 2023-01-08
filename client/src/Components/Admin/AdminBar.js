import { useState } from "react";
import NewUserModal from "./NewUserModal";

export default function AdminBar({ getUsers }) {
  const [newUserModal, setNewUserModal] = useState(false);

  return (
    <>
      <div style={{ width: "70%", margin: "0 auto", textAlign: "left" }}>
        <button
          onClick={() => {
            setNewUserModal(true);
          }}
        >
          Create New User
        </button>
      </div>
      {newUserModal ? (
        <NewUserModal setNewUserModal={setNewUserModal} getUsers={getUsers} />
      ) : (
        ""
      )}
    </>
  );
}
