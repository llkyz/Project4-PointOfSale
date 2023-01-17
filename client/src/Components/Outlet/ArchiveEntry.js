import { useState } from "react";

export default function ArchiveEntry({ entry, archiveIndex, deleteArchive }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function toggleDetails() {
    if (showDetails) {
      setShowDetails(false);
    } else {
      setShowDetails(true);
    }
  }

  function DeleteModal() {
    return (
      <>
        <div
          className="modalBackground"
          onClick={() => {
            setShowDeleteModal(false);
          }}
        />
        <div className="modal">
          <h1>Delete this archive entry?</h1>
          <button
            onClick={() => {
              deleteArchive(entry._id, archiveIndex);
              setShowDeleteModal(false);
            }}
          >
            Confirm
          </button>
          <button
            onClick={() => {
              setShowDeleteModal(false);
            }}
          >
            Cancel
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ border: "1px solid black" }} onClick={toggleDetails}>
        {showDetails ? (
          <>
            <p>Qty | Item | Total</p>
            {entry.orders.map((item) => (
              <p key={item.name}>
                {item.quantity} {item.name} {(item.lineTotal / 100).toFixed(2)}
              </p>
            ))}
            <p>Subtotal: {(entry.subtotal / 100).toFixed(2)}</p>
            <p>Tax: {(entry.tax / 100).toFixed(2)}</p>
            <p>Service Charge: {(entry.service / 100).toFixed(2)}</p>
            <p>Total: {(entry.total / 100).toFixed(2)}</p>
            <button
              onClick={() => {
                setShowDeleteModal(true);
              }}
            >
              Delete Archive
            </button>
          </>
        ) : (
          <p>
            Date: {new Date(entry.time).toLocaleString("en-SG")} | Table:{" "}
            {entry.tableName} | Total: {(entry.total / 100).toFixed(2)}{" "}
          </p>
        )}
        {showDeleteModal ? <DeleteModal /> : ""}
      </div>
    </>
  );
}
