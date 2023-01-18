import { useState } from "react";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";

export default function OutletEntry({ data, getOutletList }) {
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);

  return (
    <>
      <div>
        <div
          style={{
            display: "inline-block",
            fontSize: "20px",
            fontWeight: "bold",
            marginTop: "10px",
            marginBottom: "10px",
            marginRight: "20px",
          }}
        >
          {data.username}
        </div>
        <button
          className="functionSmall"
          style={{ fontSize: "16px", marginRight: "10px" }}
          onClick={() => {
            setShowEditUserModal(true);
          }}
        >
          Edit
        </button>
        <button
          className="functionSmall"
          style={{ fontSize: "16px" }}
          onClick={() => {
            setShowDeleteUserModal(true);
          }}
        >
          Delete
        </button>
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
