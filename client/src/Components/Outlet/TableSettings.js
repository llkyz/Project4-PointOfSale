import { DebounceInput } from "react-debounce-input";
import table from "../../Assets/table.png";

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
    <div style={{ width: "70%", margin: "0 auto" }}>
      <div className="pageHeader">
        <img src={table} className="pageImage" alt="overview" />
        <div className="pageTitle">Table Settings</div>
      </div>
      <div
        className="function"
        style={{ display: "block" }}
        onClick={() => {
          setView(false);
        }}
      >
        ← Back
      </div>
      <div className="header" style={{ marginTop: "20px" }}>
        T A B L E S
      </div>
      <div className="separator" />
      <div
        className="function"
        style={{ display: "block", marginTop: "10px", marginBottom: "10px" }}
        onClick={createNewTable}
      >
        New Table
      </div>
      <div>
        {settingData.tables.length === 0 ? (
          <h2>No tables set</h2>
        ) : (
          <>
            {settingData.tables.map((data, index) => (
              <div
                key={index}
                style={{
                  border: "2px solid black",
                  display: "inline-block",
                  width: "20%",
                  minWidth: "200px",
                  margin: "10px",
                  padding: "10px",
                  verticalAlign: "top",
                }}
              >
                <img
                  src={table}
                  style={{
                    width: "30px",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
                <h2 style={{ marginTop: "5px", marginBottom: "5px" }}>
                  Table {data}
                </h2>
                <DebounceInput
                  className="entryInput"
                  type="text"
                  value={data}
                  debounceTimeout={1000}
                  onChange={(event) => {
                    updateTable(event, index);
                  }}
                />
                <div
                  className="functionTiny"
                  style={{
                    display: "block",
                    margin: "0 auto",
                    marginTop: "10px",
                  }}
                  onClick={() => {
                    deleteTable(index);
                  }}
                >
                  Remove
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
