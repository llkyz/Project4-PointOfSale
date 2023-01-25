import { useState, useRef, useEffect } from "react";
import { DebounceInput } from "react-debounce-input";
import DeleteEntryModal from "./DeleteEntryModal";
import refresh from "../../Assets/refresh.png";

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
  const [processUploadLogo, setProcessUploadLogo] = useState();
  const [processRemoveLogo, setProcessRemoveLogo] = useState();
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
        setProcessUploadLogo();
        ref.current.value = "";
      }
      console.log(result.data);
    }
    if (uploadedFile) {
      uploadImage();
    }
    //eslint-disable-next-line
  }, [uploadedFile, categoryIndex, entryIndex]);

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
      let updatedCategoryList = menuData.categories;
      updatedCategoryList[categoryIndex].entries[entryIndex].image = "";
      setMenuData({ ...menuData, categories: updatedCategoryList });
      setUpdateMenuTrigger(true);
      setProcessRemoveLogo();
    }
  }

  let entryData = menuData.categories[categoryIndex].entries[entryIndex];

  function editEntry(updatedField) {
    let updatedCategoryList = menuData.categories;
    updatedCategoryList[categoryIndex].entries[entryIndex] = {
      ...updatedCategoryList[categoryIndex].entries[entryIndex],
      ...updatedField,
    };
    setMenuData({ ...menuData, categories: updatedCategoryList });
    setUpdateMenuTrigger(true);
  }

  function sortUp() {
    let updatedCategoryList = menuData.categories;
    let entries = updatedCategoryList[categoryIndex].entries;
    let spliced = entries.splice(entryIndex, 1)[0];
    entries.splice(entryIndex - 1, 0, spliced);
    setMenuData({ ...menuData, categories: updatedCategoryList });
    setUpdateMenuTrigger(true);
  }

  function sortDown() {
    let updatedCategoryList = menuData.categories;
    let entries = updatedCategoryList[categoryIndex].entries;
    let spliced = entries.splice(entryIndex, 1)[0];
    entries.splice(entryIndex + 1, 0, spliced);
    setMenuData({ ...menuData, categories: updatedCategoryList });
    setUpdateMenuTrigger(true);
  }

  return (
    <div
      style={{
        border: "2px solid black",
        paddingTop: "20px",
        paddingBottom: "20px",
      }}
    >
      <div className="sortContainer">
        {entryIndex === 0 ? (
          ""
        ) : (
          <div className="sortUpSmall" onClick={sortUp} />
        )}
        {entryIndex ===
        menuData.categories[categoryIndex].entries.length - 1 ? (
          ""
        ) : (
          <div className="sortDownSmall" onClick={sortDown} />
        )}
      </div>
      <div
        style={{
          display: "inline-block",
          marginLeft: "20px",
          verticalAlign: "top",
          width: "40%",
          minWidth: "230px",
        }}
      >
        <div>Name</div>
        <DebounceInput
          type="text"
          className="entryInput"
          value={entryData.name}
          debounceTimeout={1000}
          onChange={(event) => {
            editEntry({ name: event.target.value });
          }}
        />
        <div>Price ($)</div>
        <DebounceInput
          type="number"
          className="entryInput"
          value={(entryData.price / 100).toFixed(2)}
          debounceTimeout={1000}
          onChange={(event) => {
            editEntry({ price: parseInt(event.target.value * 100) });
          }}
        />
        <div>Description</div>
        <DebounceInput
          element="textarea"
          className="entryInput"
          style={{
            height: "100px",
            resize: "none",
            fontSize: "18px",
            fontFamily: "arial",
          }}
          value={entryData.description}
          debounceTimeout={1000}
          onChange={(event) => {
            editEntry({ description: event.target.value });
          }}
        />
        <div
          className="functionTiny"
          style={{ marginTop: "20px" }}
          onClick={() => {
            setShowDeleteEntryModal(true);
          }}
        >
          Delete Entry
        </div>
      </div>
      <div
        style={{
          display: "inline-block",
          verticalAlign: "top",
          marginTop: "20px",
          width: "50%",
          textAlign: "center",
        }}
      >
        <img
          src={entryData.imageUrl}
          alt="food_image"
          style={{
            width: "200px",
            maxHeight: "200px",
            objectFit: "contain",
          }}
        />
        <div>
          <div style={{ marginTop: "20px" }}>
            <input
              type="file"
              id="selectedFile"
              ref={ref}
              style={{ display: "none" }}
              onChange={(event) => {
                setProcessUploadLogo(true);
                setUploadedFile(event.target.files[0]);
              }}
            />
            <div
              className="functionTiny"
              style={{
                marginRight: "20px",
                color: processUploadLogo ? "transparent" : "",
                backgroundColor: processUploadLogo ? "lightgray" : "",
                cursor: processUploadLogo ? "default" : "",
              }}
              onClick={() => {
                if (!processUploadLogo) {
                  ref.current.click();
                }
              }}
            >
              {processUploadLogo ? (
                <img src={refresh} alt="loading" className="refresh" />
              ) : (
                ""
              )}
              Upload Image
            </div>
            <div
              className="functionTiny"
              onClick={() => {
                if (entryData.image) {
                  setProcessRemoveLogo(true);
                  removeImage();
                }
              }}
              style={{
                height: processRemoveLogo ? "30px" : "",
                color: entryData.image
                  ? processRemoveLogo
                    ? "transparent"
                    : ""
                  : "gray",
                backgroundColor: entryData.image
                  ? processRemoveLogo
                    ? "lightgray"
                    : ""
                  : "lightgray",
                cursor: entryData.image
                  ? processRemoveLogo
                    ? "default"
                    : ""
                  : "default",
                padding: processRemoveLogo ? "0 10px" : "",
              }}
            >
              {processRemoveLogo ? (
                <img src={refresh} alt="loading" className="refresh" />
              ) : (
                ""
              )}
              Remove
            </div>
          </div>
        </div>
      </div>
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
