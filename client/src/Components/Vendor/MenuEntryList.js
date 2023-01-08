import { useState } from "react";
import MenuEntry from "./MenuEntry";
import NewEntryModal from "./NewEntryModal";

export default function MenuEntryList({ entryDataList, getMenu, categoryid }) {
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);

  return (
    <>
      <p>Entry List</p>
      <button
        onClick={() => {
          setShowNewEntryModal(true);
        }}
      >
        Create New Entry
      </button>
      {entryDataList.length === 0
        ? "No entries available"
        : entryDataList.map((data) => (
            <MenuEntry key={data._id} entryData={data} getMenu={getMenu} />
          ))}
      {showNewEntryModal ? (
        <NewEntryModal
          setShowNewEntryModal={setShowNewEntryModal}
          getMenu={getMenu}
          entryDataList={entryDataList}
          categoryid={categoryid}
        />
      ) : (
        ""
      )}
    </>
  );
}
