import { useState } from "react";
import MenuCategory from "./MenuCategory";
import NewCategoryModal from "./NewCategoryModal";

export default function MenuCategoryList({ menuData, getMenu }) {
  const [showNewCateogryModal, setShowNewCategoryModal] = useState(false);

  return (
    <>
      <div>
        <h3>Categories</h3>
        <button
          onClick={() => {
            setShowNewCategoryModal(true);
          }}
        >
          New Category
        </button>
        {menuData.categories.length === 0
          ? "No categories available"
          : menuData.categories.map((data) => (
              <MenuCategory key={data._id} data={data} getMenu={getMenu} />
            ))}
      </div>
      {showNewCateogryModal ? (
        <NewCategoryModal
          setShowNewCategoryModal={setShowNewCategoryModal}
          getMenu={getMenu}
          menuData={menuData}
        />
      ) : (
        ""
      )}
    </>
  );
}
