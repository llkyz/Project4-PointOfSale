import BillEntry from "./BillEntry";

export default function OutletRegularBill({
  tableInfo,
  refreshTables,
  setShowConsolidatedBill,
}) {
  function doDeleteOrder(orderIndex) {
    let updatedList = JSON.parse(JSON.stringify(tableInfo));
    updatedList.orders.splice(orderIndex, 1);
    sendUpdate(updatedList);
  }

  async function sendUpdate(updatedList) {
    const res = await fetch("/api/outlet/order", {
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
      <button
        onClick={() => {
          setShowConsolidatedBill(true);
        }}
      >
        Swap to Consolidated
      </button>
      {tableInfo.orders.map((entry, orderIndex) => {
        return (
          <div style={{ border: "1px solid black" }} key={orderIndex}>
            <button
              onClick={() => {
                doDeleteOrder(orderIndex);
              }}
            >
              Delete Order
            </button>
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
