import { useState } from "react";
import config from "../../config";
import Cookies from "js-cookie";

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
    const res = await fetch(`${config.SERVER}/api/vendor/outlet`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
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
        <div
          className="modalClose"
          onClick={() => {
            setShowNewOutletModal(false);
          }}
        >
          x
        </div>
        <h1>Create New Outlet</h1>
        {errorMessage ? (
          <div className="error" style={{ marginTop: "20px" }}>
            {errorMessage}
          </div>
        ) : (
          ""
        )}
        <form style={{ width: "70%", margin: "0 auto", textAlign: "left" }}>
          <div style={{ marginTop: "20px" }}>
            <div>Username</div>
            <input className="modalInput" type="text" />
          </div>
          <div style={{ marginTop: "20px" }}>
            <div>Password</div>
            <input className="modalInput" type="password" />
          </div>
          <div>
            <div>Re-enter Password</div>
            <input className="modalInput" type="password" />
          </div>
          <div>
            <input
              className="modalSubmit"
              style={{ marginTop: "50px", marginBottom: "20px" }}
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
