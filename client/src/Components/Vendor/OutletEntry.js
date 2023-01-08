import { useState } from "react";
import DeleteOutletModal from "./DeleteOutletModal";
import EditOutletModal from "./EditOutletModal";

export default function OutletEntry({ data, getOutletList }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEditOutletModal, setShowEditOutletModal] = useState(false);
  const [showDeleteOutletModal, setShowDeleteOutletModal] = useState(false);

  function toggleShowDetails() {
    if (showDetails) {
      setShowDetails(false);
    } else {
      setShowDetails(true);
    }
  }

  return (
    <>
      <h2>Outlet</h2>
      <p>{data.username}</p>
      <button onClick={toggleShowDetails}>Show Details</button>
      {showDetails ? (
        <>
          <button
            onClick={() => {
              setShowEditOutletModal(true);
            }}
          >
            Edit
          </button>
          <button
            onClick={() => {
              setShowDeleteOutletModal(true);
            }}
          >
            Delete
          </button>
        </>
      ) : (
        ""
      )}
      {showEditOutletModal ? (
        <EditOutletModal
          userData={data}
          setShowEditOutletModal={setShowEditOutletModal}
          getOutletList={getOutletList}
        />
      ) : (
        ""
      )}
      {showDeleteOutletModal ? (
        <DeleteOutletModal
          userData={data}
          setShowDeleteOutletModal={setShowDeleteOutletModal}
          getOutletList={getOutletList}
        />
      ) : (
        ""
      )}
    </>
  );
}
