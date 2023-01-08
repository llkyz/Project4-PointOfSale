import { useState } from "react";

export default function DeleteEntryModal({
  setShowDeleteEntryModal,
  entryData,
  getMenu,
}) {
  const [errorMessage, setErrorMessage] = useState();

  async function doDeleteEntry() {
    const res = await fetch(`/api/vendor/menu/entry/${entryData._id}`, {
      method: "DELETE",
      credentials: "include",
    });
    let result = await res.json();
    if (res.ok) {
      console.log(result.data);
      setShowDeleteEntryModal(false);
      getMenu();
    } else {
      setErrorMessage(result.data);
    }
  }

  return (
    <>
      <div
        className="modalBackground"
        onClick={() => {
          setShowDeleteEntryModal(false);
        }}
      />
      <div className="modal">
        <h1>Delete this entry?</h1>
        {errorMessage ? <h2>{errorMessage}</h2> : ""}
        <button onClick={doDeleteEntry}>Confirm</button>
        <button
          onClick={() => {
            setShowDeleteEntryModal(false);
          }}
        >
          Cancel
        </button>
      </div>
    </>
  );
}
