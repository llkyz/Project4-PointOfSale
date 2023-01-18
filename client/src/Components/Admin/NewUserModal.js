import { useState, useEffect } from "react";

export default function NewUserModal({ setNewUserModal, getUsers }) {
  const [vendorList, setVendorList] = useState([]);
  const [formAccessLevel, setFormAccessLevel] = useState("admin");
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    async function getAllVendors() {
      const res = await fetch("/api/admin/vendorlist", {
        method: "GET",
        credentials: "include",
      });
      let result = await res.json();
      if (res.ok) {
        setVendorList(result.data);
      } else {
        console.log(result.data);
      }
    }
    getAllVendors();
  }, [setVendorList]);

  async function createNewUser(event) {
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
      accessLevel: event.target.form[3].value,
    };

    if (formBody.accessLevel === "outlet") {
      formBody.vendor = event.target.form[4].value;
    }
    const res = await fetch("/api/admin/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
    });
    let result = await res.json();
    if (res.ok) {
      setNewUserModal(false);
      getUsers();
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
          setNewUserModal(false);
        }}
      />
      <div className="modal">
        <div className="container">
          <div
            className="modalClose"
            onClick={() => {
              setNewUserModal(false);
            }}
          >
            x
          </div>
          <h1>Create New User</h1>
          <div className="separator" />
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
            <div style={{ marginTop: "20px" }}>
              <div>Access Level</div>
              <select
                className="modalInput"
                style={{ width: "30%" }}
                id="accessLevel"
                name="accessLevel"
                onChange={(event) => {
                  setFormAccessLevel(event.target.value);
                }}
              >
                <option value="admin">Admin</option>
                <option value="vendor">Vendor</option>
                <option value="outlet">Outlet</option>
              </select>
            </div>
            {formAccessLevel === "outlet" ? (
              <div style={{ marginTop: "20px" }}>
                <div>Vendor ID</div>
                <select
                  className="modalInput"
                  style={{ width: "40%" }}
                  id="vendor"
                  name="vendor"
                >
                  {vendorList.map((data) => {
                    return (
                      <option key={data.username} value={data._id}>
                        {data.username}
                      </option>
                    );
                  })}
                </select>
              </div>
            ) : (
              ""
            )}
            <div>
              <input
                className="modalSubmit"
                style={{ marginTop: "50px" }}
                type="submit"
                value="Create"
                onClick={(event) => {
                  createNewUser(event);
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
