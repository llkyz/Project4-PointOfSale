import { useState } from "react";
import OutletList from "./OutletList";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";

export default function UserEntry({ userEntryData, getUsers }) {
  const [showOutletList, setShowOutletList] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);

  function toggleOutletList() {
    if (showOutletList) {
      setShowOutletList(false);
    } else {
      setShowOutletList(true);
    }
  }

  return (
    <div className="userElement" key={userEntryData.username}>
      {userEntryData.accessLevel === "vendor" ? (
        <button
          onClick={() => {
            toggleOutletList();
          }}
        >
          Show Outlets
        </button>
      ) : (
        ""
      )}
      <button
        onClick={() => {
          setShowEditUserModal(true);
        }}
      >
        Edit
      </button>
      <button
        onClick={() => {
          setShowDeleteUserModal(true);
        }}
      >
        Delete
      </button>
      <h4>User: {userEntryData.username}</h4>
      <h4>User Type: {userEntryData.accessLevel}</h4>
      {showOutletList ? <OutletList vendorId={userEntryData._id} /> : ""}
      {showEditUserModal ? (
        <EditUserModal
          setShowEditUserModal={setShowEditUserModal}
          userData={userEntryData}
          refreshList={getUsers}
        />
      ) : (
        ""
      )}
      {showDeleteUserModal ? (
        <DeleteUserModal
          setShowDeleteUserModal={setShowDeleteUserModal}
          userData={userEntryData}
          refreshList={getUsers}
        />
      ) : (
        ""
      )}
    </div>
  );
}
