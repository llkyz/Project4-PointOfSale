import { DebounceInput } from "react-debounce-input";

export default function TableSettings({
  setView,
  settingData,
  setSettingData,
  setUpdateSettingTrigger,
}) {
  function createNewTable() {
    let updatedTableList = settingData.tables;
    updatedTableList.push("New Table");
    setSettingData({ ...settingData, tables: updatedTableList });
    setUpdateSettingTrigger(true);
  }

  function updateTable(event, index) {
    let updatedTableList = settingData.tables;
    updatedTableList[index] = event.target.value;
    setSettingData({ ...settingData, tables: updatedTableList });
    setUpdateSettingTrigger(true);
  }

  function deleteTable(index) {
    let updatedTableList = settingData.tables;
    updatedTableList.splice(index, 1);
    setSettingData({ ...settingData, tables: updatedTableList });
    setUpdateSettingTrigger(true);
  }

  return (
    <>
      <h1>Table Settings</h1>
      <button onClick={() => setView(false)}>Back</button>
      <button onClick={createNewTable}>New Table</button>
      <div>
        {settingData.tables.length === 0
          ? "No tables set"
          : settingData.tables.map((data, index) => (
              <div key={index} style={{ border: "1px solid black" }}>
                <label>Table name</label>
                <DebounceInput
                  type="text"
                  value={data}
                  debounceTimeout={1000}
                  onChange={(event) => {
                    updateTable(event, index);
                  }}
                />
                <button
                  onClick={() => {
                    deleteTable(index);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
      </div>
    </>
  );
}
