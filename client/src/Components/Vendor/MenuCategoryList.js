import MenuCategory from "./MenuCategory";

export default function MenuCategoryList({
  menuData,
  setMenuData,
  setUpdateMenuTrigger,
  getMenu,
  setShowSection,
}) {
  function createNewCategory() {
    let updatedCategoryList = menuData.categories.map((e) => e);
    updatedCategoryList.push({ name: "New Category", entries: [] });
    setMenuData({ ...menuData, categories: updatedCategoryList });
    setUpdateMenuTrigger({ setUpdateMenuTrigger });
    console.log(updatedCategoryList);
  }

  return (
    <div style={{ width: "70%", margin: "0 auto" }}>
      <div
        className="function"
        style={{ display: "block" }}
        onClick={() => {
          setShowSection();
        }}
      >
        ← Back
      </div>
      <div>
        <div className="header" style={{ marginTop: "20px" }}>
          C A T E G O R I E S
        </div>
        <div className="separator" />
        <div
          className="function"
          style={{ marginTop: "20px", marginBottom: "20px", display: "block" }}
          onClick={() => {
            createNewCategory(true);
          }}
        >
          New Category
        </div>
        {menuData.categories.length === 0 ? (
          <h2>No categories available</h2>
        ) : (
          menuData.categories.map((e, index) => (
            <MenuCategory
              key={index}
              menuData={menuData}
              categoryIndex={index}
              setMenuData={setMenuData}
              setUpdateMenuTrigger={setUpdateMenuTrigger}
              getMenu={getMenu}
            />
          ))
        )}
      </div>
    </div>
  );
}
