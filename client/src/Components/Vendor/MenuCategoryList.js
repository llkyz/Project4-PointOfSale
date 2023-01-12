import MenuCategory from "./MenuCategory";

export default function MenuCategoryList({
  menuData,
  setMenuData,
  setUpdateMenuTrigger,
  getMenu,
}) {
  function createNewCategory() {
    let updatedCategoryList = menuData.categories.map((e) => e);
    updatedCategoryList.push({ name: "New Category", entries: [] });
    setMenuData({ ...menuData, categories: updatedCategoryList });
    setUpdateMenuTrigger({ setUpdateMenuTrigger });
    console.log(updatedCategoryList);
  }

  return (
    <>
      <div>
        <h3>Categories</h3>
        <button
          onClick={() => {
            createNewCategory(true);
          }}
        >
          New Category
        </button>
        {menuData.categories.length === 0
          ? "No categories available"
          : menuData.categories.map((e, index) => (
              <MenuCategory
                key={index}
                menuData={menuData}
                categoryIndex={index}
                setMenuData={setMenuData}
                setUpdateMenuTrigger={setUpdateMenuTrigger}
                getMenu={getMenu}
              />
            ))}
      </div>
    </>
  );
}
