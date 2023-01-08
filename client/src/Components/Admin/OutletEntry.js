import { useState } from "react";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";

export default function OutletEntry({ data, getOutletList }) {
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);

  return (
    <>
      <div>
        <button
          style={{ display: "inline-block" }}
          onClick={() => {
            setShowEditUserModal(true);
          }}
        >
          Edit
        </button>
        <button
          style={{ display: "inline-block" }}
          onClick={() => {
            setShowDeleteUserModal(true);
          }}
        >
          Delete
        </button>
        <h4 style={{ display: "inline-block" }}>{data.username}</h4>
      </div>
      {showEditUserModal ? (
        <EditUserModal
          setShowEditUserModal={setShowEditUserModal}
          userData={data}
          refreshList={getOutletList}
        />
      ) : (
        ""
      )}
      {showDeleteUserModal ? (
        <DeleteUserModal
          setShowDeleteUserModal={setShowDeleteUserModal}
          userData={data}
          refreshList={getOutletList}
        />
      ) : (
        ""
      )}
    </>
  );
}
