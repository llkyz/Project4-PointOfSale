import { useState, useEffect, useRef } from "react";
import { DebounceInput } from "react-debounce-input";
import { Link } from "react-router-dom";
import MenuCategoryList from "./MenuCategoryList";
import menu from "../../Assets/menu.png";
import settings from "../../Assets/settings.png";
import admin from "../../Assets/admin.png";
import refresh from "../../Assets/refresh.png";

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
  const [showSection, setShowSection] = useState();
  const [processUploadLogo, setProcessUploadLogo] = useState();
  const [processRemoveLogo, setProcessRemoveLogo] = useState();
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
        setProcessUploadLogo();
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
      setProcessRemoveLogo();
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

  function MenuSettings() {
    return (
      <div style={{ width: "70%", margin: "0 auto" }}>
        <div
          className="function"
          style={{ display: "block" }}
          onClick={() => {
            setShowSection();
          }}
        >
          ← Back
        </div>
        <div className="header" style={{ marginTop: "20px" }}>
          S E T T I N G S
        </div>
        <div className="separator" />
        <div>
          <div style={{ width: "60%", minWidth: "300px", margin: "0 auto" }}>
            <div>
              <h1 style={{ marginBottom: "10px" }}>Logo</h1>
              <img
                src={menuData.logoUrl}
                style={{
                  width: "200px",
                  padding: "20px",
                  border: "5px solid rgb(128, 89, 79)",
                }}
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <input
                type="file"
                id="selectedFile"
                ref={ref}
                style={{ display: "none" }}
                onChange={(event) => {
                  console.log(processUploadLogo);
                  if (!processUploadLogo) {
                    setProcessUploadLogo(true);
                    setUploadedFile(event.target.files[0]);
                  }
                }}
              />
              <div
                className="functionSmall"
                style={{
                  marginRight: "20px",
                  color: processUploadLogo ? "transparent" : "",
                  backgroundColor: processUploadLogo ? "lightgray" : "",
                  cursor: processUploadLogo ? "default" : "",
                }}
                onClick={() => {
                  ref.current.click();
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
                className="functionSmall"
                onClick={() => {
                  if (menuData.logo) {
                    setProcessRemoveLogo(true);
                    removeLogo();
                  }
                }}
                style={{
                  height: processRemoveLogo ? "30px" : "",
                  color: menuData.logo
                    ? processRemoveLogo
                      ? "transparent"
                      : ""
                    : "gray",
                  backgroundColor: menuData.logo
                    ? processRemoveLogo
                      ? "lightgray"
                      : ""
                    : "lightgray",
                  cursor: menuData.logo
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
                Remove Logo
              </div>
            </div>
            <h1 style={{ marginBottom: 0, textAlign: "left" }}>Title</h1>
            <DebounceInput
              type="text"
              className="loginInput"
              value={menuData.title}
              debounceTimeout={1000}
              onChange={(event) => {
                setMenuData({ ...menuData, title: event.target.value });
                setUpdateMenuTrigger(true);
              }}
            />
            <div>
              <h1 style={{ marginBottom: 0, textAlign: "left" }}>Tax (%)</h1>
              <DebounceInput
                type="text"
                className="loginInput"
                value={menuData.tax}
                debounceTimeout={1000}
                onChange={(event) => {
                  setMenuData({ ...menuData, tax: event.target.value });
                  setUpdateMenuTrigger(true);
                }}
              />
            </div>
            <div>
              <h1 style={{ marginBottom: 0, textAlign: "left" }}>
                Service Charge (%)
              </h1>
              <DebounceInput
                type="text"
                className="loginInput"
                value={menuData.service}
                debounceTimeout={1000}
                onChange={(event) => {
                  setMenuData({ ...menuData, service: event.target.value });
                  setUpdateMenuTrigger(true);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "70%", margin: "0 auto" }}>
      <div className="pageHeader">
        <img src={menu} className="pageImage" alt="menu" />{" "}
        <div className="pageTitle">Menu Editor</div>
      </div>
      {showSection === "setting" ? <MenuSettings /> : ""}
      {showSection === "category" ? (
        <MenuCategoryList
          menuData={menuData}
          setMenuData={setMenuData}
          setUpdateMenuTrigger={setUpdateMenuTrigger}
          getMenu={getMenu}
          setShowSection={setShowSection}
        />
      ) : (
        ""
      )}
      {!showSection ? (
        <>
          <div style={{ marginTop: "100px" }}>
            <div
              className="homeLink"
              onClick={() => {
                setShowSection("setting");
              }}
            >
              <div className="container">
                <img src={settings} />
                <h1>Settings</h1>
              </div>
              <div className="description">
                <p>Edit menu title, logo, taxes, and service charges.</p>
              </div>
            </div>
            <div
              className="homeLink"
              onClick={() => {
                setShowSection("category");
              }}
            >
              <div className="container">
                <img src={admin} />
                <h1>Categories</h1>
              </div>
              <div className="description">
                <p>
                  Edit menu categories, add and remove entries from categories.
                </p>
              </div>
            </div>
          </div>
          <Link to={`/client/preview/${vendorId}`}>
            <div className="homeLink">
              <div className="container">
                <img src={menu} />
                <h1>Menu Preview</h1>
              </div>
              <div className="description">
                <p>See how your menu will look to your customers.</p>
              </div>
            </div>
          </Link>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
