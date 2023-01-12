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
    <>
      <p>Entry List</p>
      <button
        onClick={() => {
          createNewEntry();
        }}
      >
        Create New Entry
      </button>
      {menuData.categories[categoryIndex].entries.length === 0
        ? "No entries available"
        : menuData.categories[categoryIndex].entries.map((e, index) => (
            <MenuEntry
              key={index}
              entryIndex={index}
              categoryIndex={categoryIndex}
              menuData={menuData}
              setMenuData={setMenuData}
              setUpdateMenuTrigger={setUpdateMenuTrigger}
              getMenu={getMenu}
            />
          ))}
    </>
  );
}
