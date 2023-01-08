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
      accessLevel: event.target.form[2].value,
    };

    if (formBody.accessLevel === "outlet") {
      formBody.vendor = event.target.form[3].value;
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
        <button
          onClick={() => {
            setNewUserModal(false);
          }}
        >
          Close
        </button>
        <h1>Create New User</h1>
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
            <label>Access Level</label>
            <select
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
            <div>
              <label>Vendor ID</label>
              <select id="vendor" name="vendor">
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
              type="submit"
              value="Create"
              onClick={(event) => {
                createNewUser(event);
              }}
            />
          </div>
        </form>
      </div>
    </>
  );
}
