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
          <div
            className="modalClose"
            onClick={() => {
              setShowCannotDeleteModal(false);
            }}
          >
            x
          </div>
          <h1>
            Unable to delete category. Please delete all entries in this
            category first
          </h1>
          <div
            className="function"
            onClick={() => {
              setShowCannotDeleteModal(false);
            }}
          >
            Close
          </div>
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
          <div
            className="modalClose"
            onClick={() => {
              setShowDeleteCategoryModal(false);
            }}
          >
            x
          </div>
          <h1>Delete this category?</h1>
          <div
            className="function"
            style={{ marginRight: "20px" }}
            onClick={doDeleteCategory}
          >
            Confirm
          </div>
          <div
            className="function"
            onClick={() => {
              setShowDeleteCategoryModal(false);
            }}
          >
            Cancel
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        style={{
          border: "2px solid black",
          textAlign: "left",
          paddingTop: "5px",
          paddingBottom: "5px",
          position: "relative",
        }}
      >
        <div className="sortContainer">
          {categoryIndex === 0 ? (
            ""
          ) : (
            <div
              className="sortUp"
              onClick={() => {
                sortUp();
              }}
            />
          )}
          {categoryIndex === menuData.categories.length - 1 ? (
            ""
          ) : (
            <div
              className="sortDown"
              onClick={() => {
                sortDown();
              }}
            />
          )}
        </div>
        <DebounceInput
          className="categoryInput"
          type="text"
          value={menuData.categories[categoryIndex].name}
          debounceTimeout={1000}
          onChange={(event) => {
            updateCategoryName(event.target.value);
          }}
        />
        <div className="categoryDetailsContainer" onClick={toggleShowEntries}>
          <div className="categoryDetails">{showEntries ? "-" : "+"}</div>
        </div>
        {showEntries ? (
          <>
            <div
              className="functionTiny"
              style={{ marginLeft: "20px" }}
              onClick={checkDeleteCategory}
            >
              Delete Category
            </div>
            <MenuEntryList
              menuData={menuData}
              categoryIndex={categoryIndex}
              setMenuData={setMenuData}
              setUpdateMenuTrigger={setUpdateMenuTrigger}
              getMenu={getMenu}
            />
          </>
        ) : (
          ""
        )}
      </div>
      {showCannotDeleteModal ? <CannotDeleteModal /> : ""}
      {showDeleteCateogryModal ? <DeleteCategoryModal /> : ""}
    </>
  );
}
