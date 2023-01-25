import { useState } from "react";
import config from "../../../config";

export default function NewEntryModal({
  setShowNewEntryModal,
  getMenu,
  entryDataList,
  categoryid,
}) {
  const [errorMessage, setErrorMessage] = useState();

  async function createNewEntry(event) {
    event.preventDefault();
    if (
      !event.target.form[0].value ||
      !event.target.form[1].value ||
      !event.target.form[2].value
    ) {
      setErrorMessage("Please fill in the required fields");
      return;
    }
    let formBody = {
      name: event.target.form[0].value,
      description: event.target.form[1].value,
      price: event.target.form[2].value,
      order: entryDataList.length,
      category: categoryid,
    };

    // get category
    const res = await fetch(config.SERVER + "/api/vendor/menu/entry", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
    });
    let result = await res.json();
    if (res.ok) {
      setShowNewEntryModal(false);
      getMenu();
    } else {
      setErrorMessage(result.data);
    }
    console.log(result.data);
  }

  return (
    <>
      <div
        className="modalBackground"
        onClick={() => {
          setShowNewEntryModal(false);
        }}
      />
      <div className="modal">
        <button
          onClick={() => {
            setShowNewEntryModal(false);
          }}
        >
          Close
        </button>
        <h1>Create New Entry</h1>
        {errorMessage ? <h2>{errorMessage}</h2> : ""}
        <form>
          <div>
            <label>Name</label>
            <input type="text" />
          </div>
          <div>
            <label>Description</label>
            <input type="text" />
          </div>
          <div>
            <label>Price</label>
            <input type="number" />
          </div>
          <div>
            <input
              type="submit"
              value="Create"
              onClick={(event) => {
                createNewEntry(event);
              }}
            />
          </div>
        </form>
      </div>
    </>
  );
}
