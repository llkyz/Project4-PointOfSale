import { useState } from "react";

export default function DeleteEntryModal({
  setShowDeleteEntryModal,
  entryIndex,
  categoryIndex,
  menuData,
  setMenuData,
  setUpdateMenuTrigger,
}) {
  const [errorMessage, setErrorMessage] = useState();

  async function doDeleteEntry() {
    const res = await fetch("/api/vendor/menu/entry/image", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        categoryIndex: categoryIndex,
        entryIndex: entryIndex,
      }),
    });
    let result = await res.json();
    if (res.ok) {
      setShowDeleteEntryModal(false);
      let updatedCategoryList = menuData.categories.map((e) => e);
      updatedCategoryList[categoryIndex].entries.splice(entryIndex, 1);
      setMenuData({ ...menuData, categories: updatedCategoryList });
      setUpdateMenuTrigger(true);
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
