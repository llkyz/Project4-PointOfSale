import { useState, useEffect } from "react";

export default function ClientCart({
  currentOrder,
  setCurrentOrder,
  menuData,
  socket,
}) {
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    tax: 0,
    service: 0,
    total: 0,
  });
  const [added, setAdded] = useState(false);

  useEffect(() => {
    function doCalculations() {
      let subtotal = 0;
      for (let x of currentOrder.items) {
        subtotal += x.price * x.quantity;
      }
      subtotal = parseFloat(subtotal.toFixed(2));
      const tax = parseFloat(((subtotal * menuData.tax) / 100).toFixed(2));
      const service = parseFloat(
        ((subtotal * menuData.service) / 100).toFixed(2)
      );
      const total = parseFloat((subtotal + tax + service).toFixed(2));
      setCalculations({
        subtotal: subtotal,
        tax: tax,
        service: service,
        total: total,
      });
    }
    doCalculations();
  }, [currentOrder, menuData.service, menuData.tax]);

  useEffect(() => {
    socket.on("acknowledgeOrder", function () {
      console.log("Order has been received");
      setCurrentOrder({ ...currentOrder, items: [] });
    });

    return () => {
      socket.off("acknowledgeOrder");
    };
  }, [socket, currentOrder, setCurrentOrder]);

  function sendOrder() {
    console.log("Order sent");
    socket.emit("sendOrder", { data: currentOrder });
    setAdded(true);

    const myTimeout = setTimeout(() => {
      setAdded(false);
    }, 1000);
  }

  function updateQuantity(value, index) {
    let updatedItemList = currentOrder.items;
    updatedItemList[index].quantity = parseInt(value);
    updatedItemList[index].lineTotal =
      parseInt(value) * updatedItemList[index].price;
    setCurrentOrder({ ...currentOrder, items: updatedItemList });
  }

  function removeItem(index) {
    let updatedItemList = currentOrder.items;
    updatedItemList.splice(index, 1);
    setCurrentOrder({ ...currentOrder, items: updatedItemList });
  }

  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "10px" }}>Cart</h2>
      <div className="separator" style={{ marginBottom: "10px" }}></div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "10% 15% auto 20%",
          textAlign: "left",
          marginBottom: "10px",
        }}
      >
        <div></div>
        <div style={{ fontWeight: "bold" }}>Qty</div>
        <div style={{ fontWeight: "bold" }}>Item</div>
        <div style={{ fontWeight: "bold", textAlign: "right" }}>Total</div>
      </div>
      {currentOrder.items.map((data, index) => {
        return (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "10% 15% auto 20%",
              textAlign: "left",
              marginTop: "5px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                textAlign: "left",
                fontSize: "1.2em",
              }}
              onClick={() => {
                removeItem(index);
              }}
            >
              X
            </div>
            <div>
              <input
                style={{ width: "60%" }}
                type="number"
                defaultValue={data.quantity}
                onChange={(event) => {
                  if (
                    parseInt(event.target.value) < 1 ||
                    isNaN(parseInt(event.target.value))
                  ) {
                    event.target.value = "1";
                  } else {
                    updateQuantity(event.target.value, index);
                  }
                }}
              />
            </div>
            <div>{data.name}</div>
            <div style={{ textAlign: "right" }}>
              ${(data.lineTotal / 100).toFixed(2)}
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <div style={{ marginBottom: "3px" }}>
          Subtotal: ${(calculations.subtotal / 100).toFixed(2)}
        </div>
        <div style={{ marginBottom: "3px" }}>
          Tax ({menuData.tax}%): ${(calculations.tax / 100).toFixed(2)}
        </div>
        <div style={{ marginBottom: "15px" }}>
          Service Charge ({menuData.service}%): $
          {(calculations.service / 100).toFixed(2)}
        </div>
        <div>
          Total:{" "}
          <span style={{ fontWeight: "bold" }}>
            ${(calculations.total / 100).toFixed(2)}
          </span>
        </div>
      </div>

      <div style={{ marginTop: "15px" }}>
        {currentOrder.items.length === 0 ? (
          <div className="functionSmallDisabled">Send Order</div>
        ) : added ? (
          <div className="functionSmallDisabled">Order Sent</div>
        ) : (
          <div className="functionSmallMobile" onClick={sendOrder}>
            Send Order
          </div>
        )}
      </div>
    </div>
  );
}
