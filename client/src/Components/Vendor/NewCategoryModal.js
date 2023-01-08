import { useState } from "react";

export default function NewCategoryModal({
  setShowNewCategoryModal,
  getMenu,
  menuData,
}) {
  const [errorMessage, setErrorMessage] = useState();

  async function createNewCategory(event) {
    event.preventDefault();
    if (!event.target.form[0].value) {
      setErrorMessage("Please fill in the required fields");
      return;
    }
    let formBody = {
      name: event.target.form[0].value,
      order: menuData.categories.length,
    };
    const res = await fetch("/api/vendor/menu/category", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
    });
    let result = await res.json();
    if (res.ok) {
      setShowNewCategoryModal(false);
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
          setShowNewCategoryModal(false);
        }}
      />
      <div className="modal">
        <button
          onClick={() => {
            setShowNewCategoryModal(false);
          }}
        >
          Close
        </button>
        <h1>Create New Category</h1>
        {errorMessage ? <h2>{errorMessage}</h2> : ""}
        <form>
          <div>
            <label>Category Name</label>
            <input type="text" />
          </div>
          <div>
            <input
              type="submit"
              value="Create"
              onClick={(event) => {
                createNewCategory(event);
              }}
            />
          </div>
        </form>
      </div>
    </>
  );
}
