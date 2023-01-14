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
      <p key={entryIndex}>
        {item.name} | {(item.price / 100).toFixed(2)} |{" "}
        {editEntry ? (
          <input
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
        )}{" "}
        | {(lineTotalState / 100).toFixed(2)}
      </p>
      {editEntry ? (
        <>
          <button onClick={doUpdateQuantity}>Done</button>
          <button
            onClick={() => {
              setLineTotalState(item.quantity * item.price);
              setEditEntry(false);
            }}
          >
            Cancel
          </button>
        </>
      ) : deleteEntry ? (
        <>
          <button onClick={doDeleteEntry}>Confirm</button>
          <button
            onClick={() => {
              setDeleteEntry(false);
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              setEditEntry(true);
            }}
          >
            Edit
          </button>
          <button
            onClick={() => {
              setDeleteEntry(true);
            }}
          >
            Delete
          </button>
        </>
      )}
    </>
  );
}
