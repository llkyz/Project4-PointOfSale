import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function OutletTable({
  tableNum,
  tableList,
  menuData,
  createRoom,
  closeRoom,
}) {
  const [tableInfo, setTableInfo] = useState();
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    tax: 0,
    service: 0,
    total: 0,
  });

  useEffect(() => {
    if (tableList) {
      let foundIndex = tableList.map((e) => e.table).indexOf(tableNum);
      if (foundIndex != -1) {
        setTableInfo(tableList[foundIndex]);
      } else {
        setTableInfo();
      }
    }
  }, [tableList]);

  useEffect(() => {
    if (tableInfo) {
      let subtotal = 0;
      tableInfo.orders.forEach((entry) => {
        entry.forEach((item) => {
          item.lineTotal = item.price * item.quantity;
          subtotal += item.lineTotal;
        });
      });
      const tax = (subtotal * menuData.tax) / 100;
      const service = (subtotal * menuData.service) / 100;
      const total = subtotal + tax + service;
      setCalculations({
        subtotal: subtotal,
        tax: tax,
        service: service,
        total: total,
      });
    }
  }, [tableInfo]);

  return (
    <div style={{ border: "1px solid black" }}>
      <h2>Table {tableNum}</h2>

      {tableInfo ? (
        <>
          <h4>Time: {new Date(tableInfo.time).toLocaleTimeString()}</h4>
          <QRCode
            value={`localhost:3000/client/${tableInfo.room}`}
            size={200}
          />
          <button
            onClick={() => {
              closeRoom(tableInfo._id);
            }}
          >
            Close Table
          </button>
          <h4>Order List</h4>
          {tableInfo.orders.map((entry, index) => {
            return (
              <div style={{ border: "1px solid black" }} key={index}>
                {entry.map((item, index) => {
                  return (
                    <p key={index}>
                      {item.name} | {item.price} | {item.quantity} |{" "}
                      {item.lineTotal.toFixed(2)}
                    </p>
                  );
                })}
              </div>
            );
          })}
          <p>Subtotal: ${calculations.subtotal.toFixed(2)}</p>
          <p>Tax: ${calculations.tax.toFixed(2)}</p>
          <p>Service Charge: ${calculations.service.toFixed(2)}</p>
          <p>Total: ${calculations.total.toFixed(2)}</p>
        </>
      ) : (
        <button
          onClick={() => {
            createRoom(tableNum);
          }}
        >
          Open Table
        </button>
      )}
    </div>
  );
}
