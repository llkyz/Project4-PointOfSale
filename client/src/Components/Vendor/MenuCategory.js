import { useState } from "react";
import MenuEntryList from "./MenuEntryList";

export default function MenuCategory({
  menuData,
  categoryIndex,
  setMenuData,
  setUpdateMenuTrigger,
  getMenu,
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEntries, setShowEntries] = useState(false);

  function toggleShowDetails() {
    if (showDetails) {
      setShowDetails(false);
    } else {
      setShowDetails(true);
    }
  }

  function toggleShowEntries() {
    if (showEntries) {
      setShowEntries(false);
    } else {
      setShowEntries(true);
    }
  }

  function sortUp() {
    let updatedCategoryList = menuData.categories.map((e) => e);
    let spliced = updatedCategoryList.splice(categoryIndex, 1)[0];
    updatedCategoryList.splice(categoryIndex - 1, 0, spliced);
    setMenuData({ ...menuData, categories: updatedCategoryList });
    setUpdateMenuTrigger(true);
  }

  function sortDown() {
    let updatedCategoryList = menuData.categories.map((e) => e);
    let spliced = updatedCategoryList.splice(categoryIndex, 1)[0];
    updatedCategoryList.splice(categoryIndex + 1, 0, spliced);
    setMenuData({ ...menuData, categories: updatedCategoryList });
    setUpdateMenuTrigger(true);
  }

  return (
    <div style={{ border: "2px solid black" }}>
      {showDetails ? (
        <>
          <button>Edit Category</button>
          <button>Delete Category</button>
        </>
      ) : (
        ""
      )}
      <button onClick={toggleShowDetails}>Show Details</button>
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
      <h2>{menuData.categories[categoryIndex].name}</h2>
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
  );
}
