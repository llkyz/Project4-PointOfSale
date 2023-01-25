import { useState } from "react";
import config from "../../../config";

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
    const res = await fetch(config.SERVER + "/api/vendor/menu/entry/image", {
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
      <div className="modal" style={{ textAlign: "center" }}>
        <div
          className="modalClose"
          onClick={() => {
            setShowDeleteEntryModal(false);
          }}
        >
          x
        </div>
        <h1>Delete this entry?</h1>
        {errorMessage ? <h2>{errorMessage}</h2> : ""}
        <div
          className="function"
          style={{ marginRight: "20px" }}
          onClick={doDeleteEntry}
        >
          Confirm
        </div>
        <div
          className="function"
          onClick={() => {
            setShowDeleteEntryModal(false);
          }}
        >
          Cancel
        </div>
      </div>
    </>
  );
}
