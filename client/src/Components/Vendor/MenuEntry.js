import { useState, useRef, useEffect } from "react";
import { DebounceInput } from "react-debounce-input";
import DeleteEntryModal from "./DeleteEntryModal";

export default function MenuEntry({
  entryIndex,
  categoryIndex,
  menuData,
  setMenuData,
  setUpdateMenuTrigger,
  getMenu,
}) {
  const [uploadedFile, setUploadedFile] = useState();
  const [showDeleteEntryModal, setShowDeleteEntryModal] = useState(false);
  const ref = useRef();

  useEffect(() => {
    async function uploadImage() {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("categoryIndex", categoryIndex);
      formData.append("entryIndex", entryIndex);

      let res = await fetch("/api/vendor/menu/entry/image/", {
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

  async function removeImage() {
    const res = await fetch("/api/vendor/menu/entry/image", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        categoryIndex: categoryIndex,
        entryIndex: entryIndex,
      }),
    });
    if (res.ok) {
      let updatedCategoryList = menuData.categories.map((e) => e);
      updatedCategoryList[categoryIndex].entries[entryIndex].image = "";
      setMenuData({ ...menuData, categories: updatedCategoryList });
      setUpdateMenuTrigger(true);
    }
  }

  let entryData = menuData.categories[categoryIndex].entries[entryIndex];

  function editEntry(updatedField) {
    let updatedCategoryList = menuData.categories.map((e) => e);
    updatedCategoryList[categoryIndex].entries[entryIndex] = {
      ...updatedCategoryList[categoryIndex].entries[entryIndex],
      ...updatedField,
    };
    setMenuData({ ...menuData, categories: updatedCategoryList });
    setUpdateMenuTrigger(true);
  }

  function sortUp() {
    let updatedCategoryList = menuData.categories.map((e) => e);
    let entries = updatedCategoryList[categoryIndex].entries;
    let spliced = entries.splice(entryIndex, 1)[0];
    entries.splice(entryIndex - 1, 0, spliced);
    setMenuData({ ...menuData, categories: updatedCategoryList });
    setUpdateMenuTrigger(true);
  }

  function sortDown() {
    let updatedCategoryList = menuData.categories.map((e) => e);
    let entries = updatedCategoryList[categoryIndex].entries;
    let spliced = entries.splice(entryIndex, 1)[0];
    entries.splice(entryIndex + 1, 0, spliced);
    setMenuData({ ...menuData, categories: updatedCategoryList });
    setUpdateMenuTrigger(true);
  }

  return (
    <div style={{ border: "1px solid black" }}>
      <div>
        <div>
          {entryIndex === 0 ? "" : <button onClick={sortUp}>Sort Up</button>}
          {entryIndex ===
          menuData.categories[categoryIndex].entries.length - 1 ? (
            ""
          ) : (
            <button onClick={sortDown}>Sort Down</button>
          )}
        </div>
        <label>Name</label>
        <DebounceInput
          type="text"
          value={entryData.name}
          debounceTimeout={1000}
          onChange={(event) => {
            editEntry({ name: event.target.value });
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
            editEntry({ description: event.target.value });
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
            editEntry({ price: event.target.value });
          }}
        />
      </div>
      <img src={entryData.imageUrl} />
      {entryData.image.includes("placeholder") ? (
        <button onClick={removeImage}>Remove</button>
      ) : (
        ""
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
          entryIndex={entryIndex}
          categoryIndex={categoryIndex}
          menuData={menuData}
          setMenuData={setMenuData}
          setUpdateMenuTrigger={setUpdateMenuTrigger}
        />
      ) : (
        ""
      )}
    </div>
  );
}
