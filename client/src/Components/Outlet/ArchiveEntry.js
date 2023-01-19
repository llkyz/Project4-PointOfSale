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
          <div className="container">
            <div
              className="modalClose"
              onClick={() => {
                setShowDeleteModal(false);
              }}
            >
              x
            </div>
            <h1>Delete this archive entry?</h1>
            <div
              className="function"
              style={{ marginRight: "20px" }}
              onClick={() => {
                deleteArchive(entry._id, archiveIndex);
                setShowDeleteModal(false);
              }}
            >
              Confirm
            </div>
            <div
              className="function"
              onClick={() => {
                setShowDeleteModal(false);
              }}
            >
              Cancel
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="archiveGrid"
        style={{ cursor: "pointer" }}
        onClick={toggleDetails}
      >
        <div className="archiveGridEntry">
          {new Date(entry.time).toLocaleString("en-SG")}
        </div>

        <div className="archiveGridEntry">{entry.tableName}</div>
        <div className="archiveGridEntry">{(entry.total / 100).toFixed(2)}</div>
      </div>
      {showDetails ? (
        <>
          <div className="receiptGrid">
            <div className="receiptGridHeader">QTY</div>
            <div className="receiptGridHeader">ITEM</div>
            <div className="receiptGridHeader" style={{ textAlign: "right" }}>
              TOTAL
            </div>
            {entry.orders.map((item) => (
              <>
                <div className="receiptGridEntry">{item.quantity}</div>
                <div className="receiptGridEntry">{item.name}</div>
                <div
                  className="receiptGridEntry"
                  style={{ textAlign: "right" }}
                >
                  {(item.lineTotal / 100).toFixed(2)}
                </div>
              </>
            ))}
            <div className="receiptGridTotal" style={{ marginTop: "20px" }}>
              Subtotal:
            </div>
            <div
              className="receiptGridEntry"
              style={{ textAlign: "right", marginTop: "20px" }}
            >
              {(entry.subtotal / 100).toFixed(2)}
            </div>
            <div className="receiptGridTotal">Tax:</div>
            <div className="receiptGridEntry" style={{ textAlign: "right" }}>
              {(entry.tax / 100).toFixed(2)}
            </div>
            <div className="receiptGridTotal">Service Charge:</div>
            <div className="receiptGridEntry" style={{ textAlign: "right" }}>
              {(entry.service / 100).toFixed(2)}
            </div>
            <div className="receiptGridTotal" style={{ marginBottom: "20px" }}>
              Total:
            </div>
            <div className="receiptGridEntry" style={{ textAlign: "right" }}>
              {(entry.total / 100).toFixed(2)}
            </div>
          </div>
          <div
            className="functionSmall"
            style={{ marginTop: "10px", marginBottom: "10px" }}
            onClick={() => {
              setShowDeleteModal(true);
            }}
          >
            Delete Archive
          </div>
        </>
      ) : (
        ""
      )}
      {showDeleteModal ? <DeleteModal /> : ""}
    </>
  );
}
