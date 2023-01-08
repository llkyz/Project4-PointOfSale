import { useState } from "react";

export default function NewOutletModal({
  setShowNewOutletModal,
  getOutletList,
}) {
  const [errorMessage, setErrorMessage] = useState();

  async function createNewOutlet(event) {
    event.preventDefault();
    if (!event.target.form[0].value || !event.target.form[1].value) {
      setErrorMessage("Please fill in the required fields");
      return;
    }
    if (event.target.form[1].value !== event.target.form[2].value) {
      setErrorMessage("Passwords do not match");
      return;
    }

    let formBody = {
      username: event.target.form[0].value,
      password: event.target.form[1].value,
    };
    const res = await fetch("/api/vendor/outlet", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
    });
    let result = await res.json();
    if (res.ok) {
      setShowNewOutletModal(false);
      getOutletList();
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
          setShowNewOutletModal(false);
        }}
      />
      <div className="modal">
        <button
          onClick={() => {
            setShowNewOutletModal(false);
          }}
        >
          Close
        </button>
        <h1>Create New Outlet</h1>
        {errorMessage ? <h2>{errorMessage}</h2> : ""}
        <form>
          <div>
            <label>Username</label>
            <input type="text" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" />
          </div>
          <div>
            <label>Re-enter Password</label>
            <input type="password" />
          </div>
          <div>
            <input
              type="submit"
              value="Create"
              onClick={(event) => {
                createNewOutlet(event);
              }}
            />
          </div>
        </form>
      </div>
    </>
  );
}
