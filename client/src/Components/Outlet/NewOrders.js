export default function NewOrders({
  newOrderList,
  setNewOrderList,
  newOrderListRef,
  setPrintStatus,
}) {
  function closeOrder(orderIndex) {
    let updatedList = JSON.parse(JSON.stringify(newOrderList));
    updatedList.splice(orderIndex, 1);
    setNewOrderList(updatedList);
    newOrderListRef.current.splice(orderIndex, 1);
  }

  return (
    <>
      <h2>New Orders</h2>
      {newOrderList.map((newOrder, orderIndex) => (
        <div key={orderIndex} style={{ border: "1px solid black" }}>
          <button
            onClick={() => {
              setPrintStatus({ type: "order", index: orderIndex });
            }}
          >
            Print
          </button>
          <button
            onClick={() => {
              closeOrder(orderIndex);
            }}
          >
            Close
          </button>
          <h2>Table {newOrder.tableName}</h2>
          <p>Time: {new Date(newOrder.time).toLocaleTimeString()}</p>
          {newOrder.items.map((item, itemIndex) => (
            <p key={itemIndex}>
              {item.quantity}x {item.name}
            </p>
          ))}
        </div>
      ))}
    </>
  );
}
