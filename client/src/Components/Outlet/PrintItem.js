import { useState, useEffect } from "react";
import QRCode from "react-qr-code";

export default function PrintItem({
  tableList,
  newOrderList,
  printStatus,
  setPrintStatus,
  menuData,
  outletData,
}) {
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    tax: 0,
    service: 0,
    total: 0,
  });
  const [consolidatedBill, setConsolidatedBill] = useState([]);

  useEffect(() => {
    if (printStatus.type === "bill") {
      let subtotal = 0;
      for (const x of tableList[printStatus.index].orders) {
        for (const y of x) {
          subtotal += y.lineTotal;
        }
      }
      let tax = (menuData.tax * subtotal) / 100;
      let service = (menuData.service * subtotal) / 100;
      let total = subtotal + tax + service;
      setCalculations({
        subtotal: subtotal,
        tax: tax,
        service: service,
        total: total,
      });

      let consolidatedList = [];
      let newList = JSON.parse(
        JSON.stringify(tableList[printStatus.index].orders)
      );
      newList.forEach((order) => {
        order.forEach((entry) => {
          let foundIndex = consolidatedList
            .map((e) => e.name)
            .indexOf(entry.name);
          if (foundIndex !== -1) {
            consolidatedList[foundIndex].lineTotal += entry.lineTotal;
            consolidatedList[foundIndex].quantity += entry.quantity;
          } else {
            consolidatedList.push(entry);
          }
        });
      });
      setConsolidatedBill(consolidatedList);
    }
  }, [
    menuData.service,
    menuData.tax,
    printStatus.index,
    printStatus.type,
    tableList,
  ]);

  function PrintQR() {
    return (
      <>
        <h1>Table {tableList[printStatus.index].tableName}</h1>
        <p>Time: {new Date().toLocaleString()}</p>
        <QRCode
          value={`localhost:3000/client/${tableList[printStatus.index].room}`}
          size={200}
        />
        <p>Scan the QR code to order</p>
      </>
    );
  }

  function PrintBill() {
    return (
      <>
        <p>{outletData.name}</p>
        <p>{outletData.address1}</p>
        <p>{outletData.address2}</p>
        <p>
          TEL: {outletData.telephone} FAX: {outletData.fax}
        </p>
        <p>GST No: {outletData.taxNum}</p>
        {outletData.footer ? <p>{outletData.footer}</p> : ""}
        <p>============================================================</p>
        <p>
          Table: {tableList[printStatus.index].tableName}{" "}
          {new Date(tableList[printStatus.index].time).toLocaleString()}
        </p>
        <p>============================================================</p>
        <p>Qty Item Total</p>
        {consolidatedBill.map((entry, index) => {
          return (
            <p key={index}>
              {entry.quantity} {entry.name} {(entry.lineTotal / 100).toFixed(2)}
            </p>
          );
        })}
        <p>Subtotal: {(calculations.subtotal / 100).toFixed(2)}</p>
        <p>Tax: {(calculations.tax / 100).toFixed(2)}</p>
        <p>Service Charge: {(calculations.service / 100).toFixed(2)}</p>
        <p>Total: {(calculations.total / 100).toFixed(2)}</p>
        <p>============================================================</p>
        <p> THANK YOU, PLEASE COME AGAIN!</p>
      </>
    );
  }

  function PrintOrder() {
    return (
      <>
        <h1>Order Slip</h1>
        <h2>Table {newOrderList[printStatus.index].tableName}</h2>
        <h4>
          {new Date(newOrderList[printStatus.index].time).toLocaleString()}
        </h4>
        {newOrderList[printStatus.index].items.map((entry, index) => (
          <p key={index}>
            {entry.quantity}x {entry.name}
          </p>
        ))}
      </>
    );
  }

  return (
    <>
      <div className="hidePrint">
        <h1>Use Ctrl + P to print</h1>
        <button
          onClick={() => {
            setPrintStatus();
          }}
        >
          Back
        </button>
      </div>
      <div
        className="print"
        media="print"
        onClick={() => {
          setPrintStatus();
        }}
      >
        {printStatus.type === "qr" ? (
          <PrintQR />
        ) : printStatus.type === "bill" ? (
          <PrintBill />
        ) : printStatus.type === "order" ? (
          <PrintOrder />
        ) : (
          ""
        )}
      </div>
    </>
  );
}
