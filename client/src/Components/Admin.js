import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function Admin({ accessLevel }) {
  const navigate = useNavigate();
  const [userListData, setUserListData] = useState([]);

  useEffect(() => {
    if (accessLevel === "notLoggedIn") {
      navigate("/");
    }
  }, [accessLevel]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const res = await fetch("/api/admin/", {
      method: "GET",
      credentials: "include",
    });
    let result = await res.json();
    if (res.ok) {
      setUserListData(result.data);
    } else {
      console.log(result.data);
    }
  }

  return (
    <>
      <h1>Admin</h1>
      {accessLevel === "admin" ? (
        <>
          <AdminBar getUsers={getUsers} />
          <UserList userListData={userListData} />
        </>
      ) : accessLevel === "loading" ? (
        "Loading..."
      ) : (
        "Unauthorised access"
      )}
    </>
  );
}

function UserList({ userListData }) {
  return userListData.map((userEntryData) => (
    <UserEntry userEntryData={userEntryData} />
  ));
}

function UserEntry({ userEntryData }) {
  const [showOutletList, setShowOutletList] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUserData, setEditUserData] = useState();

  function toggleOutletList() {
    if (showOutletList) {
      setShowOutletList(false);
    } else {
      setShowOutletList(true);
    }
  }

  function openEditUserModal(data) {
    setEditUserData(data);
    setShowEditUserModal(true);
  }

  return (
    <div className="userElement" key={userEntryData.username}>
      {userEntryData.accessLevel === "vendor" ? (
        <button
          onClick={() => {
            toggleOutletList();
          }}
        >
          Show Outlets
        </button>
      ) : (
        ""
      )}
      <button
        onClick={() => {
          openEditUserModal(userEntryData);
        }}
      >
        Edit
      </button>
      <h4>User: {userEntryData.username}</h4>
      <h4>User Type: {userEntryData.accessLevel}</h4>
      {showOutletList ? <OutletList vendorName={userEntryData.username} /> : ""}
      {showEditUserModal ? (
        <EditUserModal
          setShowEditUserModal={setShowEditUserModal}
          editUserData={editUserData}
        />
      ) : (
        ""
      )}
    </div>
  );
}

function OutletList({ vendorName }) {
  const [outletList, setOutletList] = useState([]);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUserData, setEditUserData] = useState();

  useEffect(() => {
    getOutletList();
  }, []);

  async function getOutletList() {
    const res = await fetch(`/api/vendor/index/${vendorName}`, {
      method: "GET",
      credentials: "include",
    });
    let result = await res.json();
    if (res.ok) {
      setOutletList(result.data);
    } else {
      console.log(result.data);
    }
  }

  function openEditUserModal(data) {
    setEditUserData(data);
    setShowEditUserModal(true);
  }

  return (
    <>
      <h2>Outlets</h2>
      <button onClick={getOutletList}>Refresh</button>
      {outletList.map((data) => {
        return (
          <div>
            <button
              style={{ display: "inline-block" }}
              onClick={() => {
                openEditUserModal(data);
              }}
            >
              Edit
            </button>
            <h4 style={{ display: "inline-block" }}>{data.username}</h4>
          </div>
        );
      })}
      {showEditUserModal ? (
        <EditUserModal
          setShowEditUserModal={setShowEditUserModal}
          editUserData={editUserData}
        />
      ) : (
        ""
      )}
    </>
  );
}

function AdminBar({ getUsers }) {
  const [newUserModal, setNewUserModal] = useState(false);

  return (
    <>
      <div style={{ width: "70%", margin: "0 auto", textAlign: "left" }}>
        <button
          onClick={() => {
            setNewUserModal(true);
          }}
        >
          Create New User
        </button>
      </div>
      {newUserModal ? (
        <NewUserModal setNewUserModal={setNewUserModal} getUsers={getUsers} />
      ) : (
        ""
      )}
    </>
  );
}

function NewUserModal({ setNewUserModal, getUsers }) {
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
    let formBody = {
      username: event.target.form[0].value,
      password: event.target.form[1].value,
      accessLevel: event.target.form[2].value,
    };

    if (formBody.accessLevel === "outlet") {
      formBody.vendor = event.target.form[3].value;
    }
    console.log(formBody);
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
            <input type="text" placeholder="Username" />
          </div>
          <div>
            <label>Password</label>
            <input type="text" placeholder="Password" />
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
                    <option key={data.username} value={data.username}>
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

function EditUserModal({ setShowEditUserModal, editUserData }) {
  return (
    <>
      <div
        className="modalBackground"
        onClick={() => {
          setShowEditUserModal(false);
        }}
      />
      <div className="modal">
        <h1>Edit User</h1>
        <p>{JSON.stringify(editUserData)}</p>
      </div>
    </>
  );
}
