import { useState, useRef, useEffect } from "react";
import { DebounceInput } from "react-debounce-input";
import DeleteEntryModal from "./DeleteEntryModal";

export default function MenuEntry({ entryData, getMenu }) {
  const [entryDataState, setEntryDataState] = useState(entryData);
  const [uploadedFile, setUploadedFile] = useState();
  const [isMounted, setIsMounted] = useState(false);
  const [showDeleteEntryModal, setShowDeleteEntryModal] = useState(false);
  const ref = useRef();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function uploadImage() {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      let res = await fetch(`/api/vendor/menu/entry/image/${entryData._id}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      let result = await res.json();
      if (res.ok) {
        getMenu();
        ref.current.value = "";
      }
      console.log(result.data);
    }
    if (uploadedFile) {
      uploadImage();
    }
  }, [uploadedFile]);

  useEffect(() => {
    async function editEntry() {
      if (
        !entryDataState.name ||
        !entryDataState.description ||
        !entryDataState.price
      ) {
        console.log("Missing a field");
        return;
      }

      let formBody = {
        name: entryDataState.name,
        description: entryDataState.description,
        price: entryDataState.price,
      };
      let res = await fetch(`/api/vendor/menu/entry/${entryData._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formBody),
      });
      let result = await res.json();
      if (res.ok) {
        getMenu();
        ref.current.value = "";
      }
      console.log(result.data);
    }
    if (isMounted) {
      editEntry();
    }
  }, [entryDataState]);

  async function removeImage() {
    let res = await fetch(`/api/vendor/menu/entry/image/${entryData._id}`, {
      method: "DELETE",
      credentials: "include",
    });
    let result = await res.json();
    if (res.ok) {
      getMenu();
    }
    console.log(result.data);
  }

  return (
    <div style={{ border: "1px solid black" }}>
      <div>
        <label>Name</label>
        <DebounceInput
          type="text"
          value={entryData.name}
          debounceTimeout={1000}
          onChange={(event) => {
            setEntryDataState({ ...entryDataState, name: event.target.value });
          }}
        />
      </div>
      <div>
        <label>Description</label>
        <DebounceInput
          type="text"
          value={entryData.description}
          debounceTimeout={1000}
          onChange={(event) => {
            setEntryDataState({
              ...entryDataState,
              description: event.target.value,
            });
          }}
        />
      </div>
      <div>
        <label>Price</label>
        <DebounceInput
          type="number"
          value={entryData.price}
          debounceTimeout={1000}
          onChange={(event) => {
            setEntryDataState({ ...entryDataState, price: event.target.value });
          }}
        />
      </div>
      {entryData.image ? (
        <>
          <img
            src={`https://storage.cloud.google.com/pos-system/${entryData.image}`}
          />
          <button onClick={removeImage}>Remove</button>
        </>
      ) : (
        <img
          src={`https://storage.cloud.google.com/pos-system/placeholder.jpg`}
        />
      )}
      <div>
        <input
          type="file"
          id="selectedFile"
          ref={ref}
          style={{ display: "none" }}
          onChange={(event) => setUploadedFile(event.target.files[0])}
        />
        <input
          type="button"
          value="Browse..."
          onClick={() => {
            ref.current.click();
          }}
        />
      </div>
      <button
        onClick={() => {
          setShowDeleteEntryModal(true);
        }}
      >
        Delete Entry
      </button>
      <p>{JSON.stringify(entryData)}</p>
      {showDeleteEntryModal ? (
        <DeleteEntryModal
          setShowDeleteEntryModal={setShowDeleteEntryModal}
          entryData={entryData}
          getMenu={getMenu}
        />
      ) : (
        ""
      )}
    </div>
  );
}
