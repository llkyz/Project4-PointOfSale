import { useState, useEffect } from "react";
import ReceiptSettings from "./ReceiptSettings";
import TableSettings from "./TableSettings";

export default function OutletSettings({ accessLevel }) {
  const [settingData, setSettingData] = useState();
  const [updateSettingTrigger, setUpdateSettingTrigger] = useState(false);
  const [view, setView] = useState();

  useEffect(() => {
    async function getSettingData() {
      const res = await fetch("/api/outlet/setting", {
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
      const res = await fetch(`/api/outlet/setting/`, {
        method: "PUT",
        credentials: "include",
        headers: {
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
          <h1>Outlet Settings</h1>
          <div
            style={{ display: "inline-block", border: "1px solid black" }}
            onClick={() => {
              setView("receipt");
            }}
          >
            Receipt Settings
          </div>
          <div
            style={{ display: "inline-block", border: "1px solid black" }}
            onClick={() => {
              setView("table");
            }}
          >
            Table Settings
          </div>
        </>
      )}
    </>
  );
}
