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
        <h1>Delete this outlet?</h1>
        {errorMessage ? <h2>{errorMessage}</h2> : ""}
        <button onClick={doDeleteOutlet}>Confirm</button>
        <button
          onClick={() => {
            setShowDeleteOutletModal(false);
          }}
        >
          Cancel
        </button>
      </div>
    </>
  );
}
