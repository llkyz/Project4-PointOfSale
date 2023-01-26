import { useState, useRef } from "react";

export default function BillEntry({
  item,
  entryIndex,
  orderIndex,
  tableInfo,
  sendUpdate,
}) {
  const [editEntry, setEditEntry] = useState(false);
  const [deleteEntry, setDeleteEntry] = useState(false);
  const [lineTotalState, setLineTotalState] = useState(item.lineTotal);
  const ref = useRef();

  function doUpdateQuantity() {
    let updatedList = JSON.parse(JSON.stringify(tableInfo));
    updatedList.orders[orderIndex][entryIndex].quantity = parseInt(
      ref.current.value
    );
    updatedList.orders[orderIndex][entryIndex].lineTotal =
      updatedList.orders[orderIndex][entryIndex].quantity *
      updatedList.orders[orderIndex][entryIndex].price;
    sendUpdate(updatedList);
    setEditEntry(false);
  }

  async function doDeleteEntry() {
    let updatedList = JSON.parse(JSON.stringify(tableInfo));
    updatedList.orders[orderIndex].splice(entryIndex, 1);
    if (updatedList.orders[orderIndex].length === 0) {
      updatedList.orders.splice(orderIndex, 1);
    }
    sendUpdate(updatedList);
  }

  return (
    <>
      <div>
        {editEntry ? (
          <input
            className="billEdit"
            type="number"
            ref={ref}
            defaultValue={item.quantity}
            onChange={(event) => {
              if (
                parseInt(event.target.value) < 1 ||
                isNaN(parseInt(event.target.value))
              ) {
                event.target.value = "1";
              } else {
                setLineTotalState(event.target.value * item.price);
              }
            }}
          />
        ) : (
          item.quantity
        )}
      </div>
      <div>{item.name}</div>
      <div>{(lineTotalState / 100).toFixed(2)}</div>
      <div style={{ textAlign: "center" }}>
        {editEntry ? (
          <>
            <div
              className="functionBill"
              style={{ marginRight: "10px" }}
              onClick={doUpdateQuantity}
            >
              Done
            </div>
            <div
              className="functionBill"
              onClick={() => {
                setLineTotalState(item.quantity * item.price);
                setEditEntry(false);
              }}
            >
              Cancel
            </div>
          </>
        ) : deleteEntry ? (
          <>
            <div
              className="functionBill"
              style={{ marginRight: "10px" }}
              onClick={doDeleteEntry}
            >
              Confirm
            </div>
            <div
              className="functionBill"
              onClick={() => {
                setDeleteEntry(false);
              }}
            >
              Cancel
            </div>
          </>
        ) : (
          <>
            <div
              className="functionBill"
              style={{ marginRight: "10px" }}
              onClick={() => {
                setEditEntry(true);
              }}
            >
              Edit
            </div>
            <div
              className="functionBill"
              onClick={() => {
                setDeleteEntry(true);
              }}
            >
              Delete
            </div>
          </>
        )}
      </div>
    </>
  );
}
