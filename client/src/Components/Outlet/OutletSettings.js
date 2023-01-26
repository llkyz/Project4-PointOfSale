import { useState, useEffect } from "react";
import ReceiptSettings from "./ReceiptSettings";
import TableSettings from "./TableSettings";
import settings from "../../Assets/settings.png";
import table from "../../Assets/table.png";
import receipt from "../../Assets/receipt.png";
import config from "../../config";
import Cookies from "js-cookie";

export default function OutletSettings({ accessLevel }) {
  const [settingData, setSettingData] = useState();
  const [updateSettingTrigger, setUpdateSettingTrigger] = useState(false);
  const [view, setView] = useState();

  useEffect(() => {
    async function getSettingData() {
      const res = await fetch(`${config.SERVER}/api/outlet/setting`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        method: "GET",
        credentials: "include",
      });
      let result = await res.json();
      if (res.ok) {
        setSettingData(result.data);
      } else {
        console.log(result.data);
      }
    }
    getSettingData();
  }, []);

  useEffect(() => {
    async function updateSettingData() {
      const res = await fetch(`${config.SERVER}/api/outlet/setting/`, {
        method: "PUT",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingData),
      });
      let result = await res.json();
      if (res.ok) {
        setUpdateSettingTrigger(false);
      }
      console.log(result.data);
    }
    if (updateSettingTrigger) {
      updateSettingData();
    }
  }, [updateSettingTrigger, settingData]);

  return (
    <>
      {!settingData ? (
        "Loading..."
      ) : view === "table" ? (
        <TableSettings
          setView={setView}
          settingData={settingData}
          setSettingData={setSettingData}
          setUpdateSettingTrigger={setUpdateSettingTrigger}
        />
      ) : view === "receipt" ? (
        <ReceiptSettings
          setView={setView}
          settingData={settingData}
          setSettingData={setSettingData}
          setUpdateSettingTrigger={setUpdateSettingTrigger}
        />
      ) : (
        <>
          <div className="pageHeader">
            <img className="pageImage" src={settings} />
            <div className="pageTitle">Outlet Settings</div>
          </div>
          <div style={{ marginTop: "150px" }}>
            <div
              className="homeLink"
              onClick={() => {
                setView("receipt");
              }}
            >
              <div className="container">
                <img src={receipt} />
                <h1>Receipt Settings</h1>
              </div>
              <div className="description">
                <p>
                  Configure information that will be displayed on customer
                  receipts.
                </p>
              </div>
            </div>
            <div
              className="homeLink"
              onClick={() => {
                setView("table");
              }}
            >
              <div className="container">
                <img src={table} />
                <h1>Table Settings</h1>
              </div>
              <div className="description">
                <p>Add, remove, and rename seating tables.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
