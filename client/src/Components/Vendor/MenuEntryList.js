import MenuEntry from "./MenuEntry";

export default function MenuEntryList({
  menuData,
  categoryIndex,
  setMenuData,
  setUpdateMenuTrigger,
  getMenu,
}) {
  function createNewEntry() {
    let updatedCategories = menuData.categories.map((e) => e);
    updatedCategories[categoryIndex].entries.push({
      name: "New Entry",
      description: "Description",
      price: 0,
      image: "",
    });
    setMenuData({ ...menuData, categories: updatedCategories });
    setUpdateMenuTrigger(true);
  }

  return (
    <div
      style={{
        paddingLeft: "65px",
        paddingRight: "65px",
        paddingBottom: "20px",
      }}
    >
      <div className="header" style={{ fontSize: "1.7em" }}>
        E N T R I E S
      </div>
      <div className="separator" />
      {menuData.categories[categoryIndex].entries.length === 0 ? (
        <h2>No entries available</h2>
      ) : (
        menuData.categories[categoryIndex].entries.map((e, index) => (
          <MenuEntry
            key={index}
            entryIndex={index}
            categoryIndex={categoryIndex}
            menuData={menuData}
            setMenuData={setMenuData}
            setUpdateMenuTrigger={setUpdateMenuTrigger}
            getMenu={getMenu}
          />
        ))
      )}
      <div
        className="functionSmall"
        style={{ marginTop: "10px", marginBottom: "10px" }}
        onClick={() => {
          createNewEntry();
        }}
      >
        Create New Entry
      </div>
    </div>
  );
}
