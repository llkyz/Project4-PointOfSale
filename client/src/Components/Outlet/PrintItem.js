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
        <p style={{ fontWeight: "bold" }}>
          Time: {new Date().toLocaleString()}
        </p>
        <QRCode
          value={`localhost:3000/client/${tableList[printStatus.index].room}`}
          size={200}
        />
        <p style={{ fontWeight: "bold" }}>Scan the QR code to order</p>
      </>
    );
  }

  function PrintBill() {
    return (
      <>
        <div>{outletData.name}</div>
        <div>{outletData.address1}</div>
        <div>{outletData.address2}</div>
        <div>
          TEL: {outletData.telephone} FAX: {outletData.fax}
        </div>
        <div>GST No: {outletData.taxNum}</div>
        {outletData.footer ? <div>{outletData.footer}</div> : ""}
        <div>=======================================</div>
        <div>
          <span style={{ float: "left" }}>
            Table: {tableList[printStatus.index].tableName}
          </span>
          <span style={{ float: "right" }}>
            {new Date(tableList[printStatus.index].time).toLocaleString()}
          </span>
        </div>
        <div>=======================================</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "10% auto 15%",
            textAlign: "left",
            marginBottom: "10px",
          }}
        >
          <div>Qty</div>
          <div>Item</div>
          <div style={{ textAlign: "right" }}>Total</div>
        </div>
        {consolidatedBill.map((entry, index) => {
          return (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "10% auto 15%",
                textAlign: "left",
              }}
            >
              <div>{entry.quantity}</div>
              <div>{entry.name}</div>
              <div style={{ textAlign: "right" }}>
                {(entry.lineTotal / 100).toFixed(2)}
              </div>
            </div>
          );
        })}
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <div>Subtotal: {(calculations.subtotal / 100).toFixed(2)}</div>
          <div>
            Tax ({menuData.tax}%): {(calculations.tax / 100).toFixed(2)}
          </div>
          <div>
            Service Charge ({menuData.service}%):{" "}
            {(calculations.service / 100).toFixed(2)}
          </div>
          <div style={{ marginTop: "20px" }}>
            Total: {(calculations.total / 100).toFixed(2)}
          </div>
        </div>
        <p>=======================================</p>
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
        <div
          className="function"
          style={{ marginBottom: "20px" }}
          onClick={() => {
            setPrintStatus();
          }}
        >
          Back To Table
        </div>
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
