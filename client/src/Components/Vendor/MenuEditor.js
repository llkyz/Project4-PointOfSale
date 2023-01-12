import { useState, useEffect, useRef } from "react";
import { DebounceInput } from "react-debounce-input";
import { Link } from "react-router-dom";
import MenuCategoryList from "./MenuCategoryList";

export default function MenuEditor() {
  const [menuData, setMenuData] = useState({
    title: "",
    tax: 0,
    service: 0,
    logo: "",
    categories: [],
  });
  const [uploadedFile, setUploadedFile] = useState();
  const [updateMenuTrigger, setUpdateMenuTrigger] = useState(false);
  const [vendorId, setVendorId] = useState();
  const ref = useRef();

  useEffect(() => {
    getMenu();
    getVendorId();
  }, []);

  useEffect(() => {
    async function uploadLogo() {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      let res = await fetch("/api/vendor/menu/logo", {
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
      uploadLogo();
    }
  }, [uploadedFile]);

  useEffect(() => {
    async function updateMenu() {
      let formBody = {
        service: menuData.service,
        tax: menuData.tax,
        title: menuData.title,
        categories: menuData.categories,
      };

      const res = await fetch("/api/vendor/menu", {
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
      }
      console.log(result.data);
    }
    if (updateMenuTrigger) {
      updateMenu();
      setUpdateMenuTrigger(false);
    }
  }, [menuData]);

  async function getVendorId() {
    const res = await fetch("/api/user/id", {
      method: "GET",
      credentials: "include",
    });
    let result = await res.json();
    if (res.ok) {
      setVendorId(result.data);
    } else {
      console.log(result.data);
    }
  }

  async function removeLogo() {
    let res = await fetch("/api/vendor/menu/logo", {
      method: "DELETE",
      credentials: "include",
    });
    let result = await res.json();
    if (res.ok) {
      getMenu();
    }
    console.log(result.data);
  }

  async function getMenu() {
    const res = await fetch("/api/vendor/menu", {
      method: "GET",
      credentials: "include",
    });
    let result = await res.json();
    if (res.ok) {
      setMenuData(result.data);
    } else {
      createMenu();
    }
  }

  async function createMenu() {
    const res = await fetch("/api/vendor/menu", {
      method: "POST",
      credentials: "include",
    });
    let result = await res.json();
    if (res.ok) {
      setMenuData(result.data);
    } else {
      console.log(result.data);
    }
  }

  return (
    <>
      <h1>Menu Editor</h1>
      <Link to={`/client/preview/${vendorId}`}>
        <button>Menu Preview</button>
      </Link>
      <div>
        <label>Title</label>
        <DebounceInput
          type="text"
          value={menuData.title}
          debounceTimeout={1000}
          onChange={(event) => {
            setMenuData({ ...menuData, title: event.target.value });
            setUpdateMenuTrigger(true);
          }}
        />
      </div>
      <div>
        <label>Logo</label>
        <img src={menuData.logoUrl} />
        {menuData.logo.includes("placeholder") ? (
          <button onClick={removeLogo}>Remove Logo</button>
        ) : (
          ""
        )}
      </div>
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
      <div>
        <label>Tax</label>
        <DebounceInput
          type="text"
          value={menuData.tax}
          debounceTimeout={1000}
          onChange={(event) => {
            setMenuData({ ...menuData, tax: event.target.value });
            setUpdateMenuTrigger(true);
          }}
        />
      </div>
      <div>
        <label>Service Charge</label>
        <DebounceInput
          type="text"
          value={menuData.service}
          debounceTimeout={1000}
          onChange={(event) => {
            setMenuData({ ...menuData, service: event.target.value });
            setUpdateMenuTrigger(true);
          }}
        />
      </div>
      <MenuCategoryList
        menuData={menuData}
        setMenuData={setMenuData}
        setUpdateMenuTrigger={setUpdateMenuTrigger}
        getMenu={getMenu}
      />
      {JSON.stringify(menuData)}
    </>
  );
}
