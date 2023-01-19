import { useState } from "react";

export default function DeleteOutletModal({
  setShowDeleteOutletModal,
  userData,
  getOutletList,
}) {
  const [errorMessage, setErrorMessage] = useState();

  async function doDeleteOutlet() {
    const res = await fetch(`/api/vendor/outlet/${userData._id}`, {
      method: "DELETE",
      credentials: "include",
    });
    let result = await res.json();
    if (res.ok) {
      console.log(result.data);
      setShowDeleteOutletModal(false);
      getOutletList();
    } else {
      setErrorMessage(result.data);
    }
  }

  return (
    <>
      <div
        className="modalBackground"
        onClick={() => {
          setShowDeleteOutletModal(false);
        }}
      />
      <div className="modal">
        <div className="container">
          <div
            className="modalClose"
            onClick={() => {
              setShowDeleteOutletModal(false);
            }}
          >
            x
          </div>
          <h1>Delete this outlet?</h1>
          {errorMessage ? (
            <div className="error" style={{ marginTop: "20px" }}>
              {errorMessage}
            </div>
          ) : (
            ""
          )}
          <div
            className="function"
            style={{ marginRight: "20px" }}
            onClick={doDeleteOutlet}
          >
            Confirm
          </div>
          <div
            className="function"
            onClick={() => {
              setShowDeleteOutletModal(false);
            }}
          >
            Cancel
          </div>
        </div>
      </div>
    </>
  );
}
