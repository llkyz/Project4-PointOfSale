import { useState } from "react";
import MenuEntryList from "./MenuEntryList";

export default function MenuCategory({ data, getMenu }) {
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
      <p>
        {data.name}, order: {data.order}
      </p>
      <button onClick={toggleShowEntries}>Show Entries</button>
      {showEntries ? (
        <MenuEntryList
          entryDataList={data.entries}
          getMenu={getMenu}
          categoryid={data._id}
        />
      ) : (
        ""
      )}
    </div>
  );
}
