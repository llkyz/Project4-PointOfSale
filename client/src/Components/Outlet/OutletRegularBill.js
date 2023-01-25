import BillEntry from "./BillEntry";
import config from "../../../config";

export default function OutletRegularBill({ tableInfo, refreshTables }) {
  function doDeleteOrder(orderIndex) {
    let updatedList = JSON.parse(JSON.stringify(tableInfo));
    updatedList.orders.splice(orderIndex, 1);
    sendUpdate(updatedList);
  }

  async function sendUpdate(updatedList) {
    const res = await fetch(config.SERVER + "/api/outlet/order", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedList),
    });
    let result = await res.json();
    if (res.ok) {
      refreshTables();
      return true;
    }
    console.log(result.data);
  }

  return (
    <>
      {tableInfo.orders.map((entry, orderIndex) => {
        return (
          <div className="billOrder" key={orderIndex}>
            <div
              className="modalClose"
              style={{ top: "-20px", right: "-35px" }}
              onClick={() => {
                doDeleteOrder(orderIndex);
              }}
            >
              x
            </div>
            {entry.map((item, entryIndex) => (
              <BillEntry
                key={entryIndex}
                item={item}
                entryIndex={entryIndex}
                orderIndex={orderIndex}
                tableInfo={tableInfo}
                sendUpdate={sendUpdate}
              />
            ))}
          </div>
        );
      })}
    </>
  );
}
