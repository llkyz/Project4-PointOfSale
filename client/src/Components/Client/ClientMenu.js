export default function ClientMenu({
  menuData,
  setContentIndex,
  setEntryIndex,
  setShowMenu,
}) {
  return (
    <>
      <h2 style={{ marginBottom: "10px" }}>Menu</h2>
      <div
        className="separator"
        style={{ width: "90%", margin: "0 auto 10px auto" }}
      />
      {menuData.categories.map((data, index) => {
        return (
          <h2
            key={index}
            onClick={() => {
              setShowMenu(false);
              setContentIndex(index);
              setEntryIndex();
            }}
          >
            {data.name}
          </h2>
        );
      })}
    </>
  );
}
