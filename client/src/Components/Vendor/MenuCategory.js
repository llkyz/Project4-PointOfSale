import { useState } from "react";
import MenuEntryList from "./MenuEntryList";
import { DebounceInput } from "react-debounce-input";

export default function MenuCategory({
  menuData,
  categoryIndex,
  setMenuData,
  setUpdateMenuTrigger,
  getMenu,
}) {
  const [showDeleteCateogryModal, setShowDeleteCategoryModal] = useState(false);
  const [showCannotDeleteModal, setShowCannotDeleteModal] = useState(false);
  const [showEntries, setShowEntries] = useState(false);

  function toggleShowEntries() {
    if (showEntries) {
      setShowEntries(false);
    } else {
      setShowEntries(true);
    }
  }

  function sortUp() {
    let updatedCategoryList = menuData.categories;
    let spliced = updatedCategoryList.splice(categoryIndex, 1)[0];
    updatedCategoryList.splice(categoryIndex - 1, 0, spliced);
    setMenuData({ ...menuData, categories: updatedCategoryList });
    setUpdateMenuTrigger(true);
  }

  function sortDown() {
    let updatedCategoryList = menuData.categories;
    let spliced = updatedCategoryList.splice(categoryIndex, 1)[0];
    updatedCategoryList.splice(categoryIndex + 1, 0, spliced);
    setMenuData({ ...menuData, categories: updatedCategoryList });
    setUpdateMenuTrigger(true);
  }

  function updateCategoryName(newName) {
    let updatedCategoryList = menuData.categories;
    updatedCategoryList[categoryIndex].name = newName;
    setMenuData({ ...menuData, categories: updatedCategoryList });
    setUpdateMenuTrigger(true);
  }

  function checkDeleteCategory() {
    if (menuData.categories[categoryIndex].entries.length !== 0) {
      setShowCannotDeleteModal(true);
    } else {
      setShowDeleteCategoryModal(true);
    }
  }

  function doDeleteCategory() {
    let updatedCategoryList = menuData.categories;
    updatedCategoryList.splice(categoryIndex, 1);
    setMenuData({ ...menuData, categories: updatedCategoryList });
    setUpdateMenuTrigger(true);
  }

  function CannotDeleteModal() {
    return (
      <>
        <div
          className="modalBackground"
          onClick={() => {
            setShowCannotDeleteModal(false);
          }}
        />
        <div className="modal">
          <h1>
            Unable to delete category. Please delete all entries in this
            category first
          </h1>
          <button
            onClick={() => {
              setShowCannotDeleteModal(false);
            }}
          >
            Close
          </button>
        </div>
      </>
    );
  }

  function DeleteCategoryModal() {
    return (
      <>
        <div
          className="modalBackground"
          onClick={() => {
            setShowDeleteCategoryModal(false);
          }}
        />
        <div className="modal">
          <h1>Delete this category?</h1>
          <button onClick={doDeleteCategory}>Confirm</button>
          <button
            onClick={() => {
              setShowDeleteCategoryModal(false);
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
      <div style={{ border: "2px solid black" }}>
        <button onClick={checkDeleteCategory}>Delete Category</button>
        <h3>-------------------------------</h3>
        {categoryIndex === 0 ? (
          ""
        ) : (
          <button
            onClick={() => {
              sortUp();
            }}
          >
            Sort Up
          </button>
        )}
        {categoryIndex === menuData.categories.length - 1 ? (
          ""
        ) : (
          <button
            onClick={() => {
              sortDown();
            }}
          >
            Sort Down
          </button>
        )}
        <DebounceInput
          type="text"
          value={menuData.categories[categoryIndex].name}
          debounceTimeout={1000}
          onChange={(event) => {
            updateCategoryName(event.target.value);
          }}
        />
        <button onClick={toggleShowEntries}>Show Entries</button>
        {showEntries ? (
          <MenuEntryList
            menuData={menuData}
            categoryIndex={categoryIndex}
            setMenuData={setMenuData}
            setUpdateMenuTrigger={setUpdateMenuTrigger}
            getMenu={getMenu}
          />
        ) : (
          ""
        )}
      </div>
      {showCannotDeleteModal ? <CannotDeleteModal /> : ""}
      {showDeleteCateogryModal ? <DeleteCategoryModal /> : ""}
    </>
  );
}
