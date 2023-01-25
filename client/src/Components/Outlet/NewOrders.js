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
    <div style={{ marginLeft: "5%", marginRight: "5%", paddingBottom: "50px" }}>
      <h2 style={{ marginBottom: "10px" }}>New Orders</h2>
      <div className="separator" style={{ marginBottom: "10px" }} />

      {newOrderList.map((newOrder, orderIndex) => (
        <div key={orderIndex} className="newOrderEntry">
          <div
            className="functionSmall"
            style={{ position: "absolute", left: "10px", top: "10px" }}
            onClick={() => {
              setPrintStatus({ type: "order", index: orderIndex });
            }}
          >
            Print
          </div>
          <div
            className="modalClose"
            style={{ top: "0", right: "15px" }}
            onClick={() => {
              closeOrder(orderIndex);
            }}
          >
            x
          </div>
          <h2 style={{ marginTop: "15px" }}>Table {newOrder.tableName}</h2>
          <p>Time: {new Date(newOrder.time).toLocaleTimeString()}</p>
          {newOrder.items.map((item, itemIndex) => (
            <p key={itemIndex}>
              {item.quantity}x {item.name}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
