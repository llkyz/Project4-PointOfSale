import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import OutletRegularBill from "./OutletRegularBill";
import OutletConsolidatedBill from "./OutletConsolidatedBill";

export default function OutletTable({
  tableNum,
  tableName,
  tableList,
  menuData,
  createRoom,
  closeRoom,
  refreshTables,
  setPrintBill,
  setPrintCode,
}) {
  const [tableInfo, setTableInfo] = useState();
  const [showConsolidatedBill, setShowConsolidatedBill] = useState(false);
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    tax: 0,
    service: 0,
    total: 0,
  });
  const [consolidatedBill, setConsolidatedBill] = useState();

  useEffect(() => {
    if (tableList) {
      let foundIndex = tableList.map((e) => e.tableNum).indexOf(tableNum);
      if (foundIndex !== -1) {
        setTableInfo(tableList[foundIndex]);
      } else {
        setTableInfo();
      }
    }
  }, [tableList, tableNum]);

  useEffect(() => {
    if (tableInfo) {
      let consolidatedList = [];
      let newList = JSON.parse(JSON.stringify(tableInfo.orders));
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

      let subtotal = 0;
      tableInfo.orders.forEach((entry) => {
        entry.forEach((item) => {
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
  }, [tableInfo, menuData.tax, menuData.service]);

  return (
    <>
      <div style={{ border: "1px solid black" }}>
        <button
          onClick={() => {
            setPrintCode(tableNum);
          }}
        >
          Print QR Code
        </button>
        <button
          onClick={() => {
            setPrintBill(tableNum);
          }}
        >
          Print Bill
        </button>
        <h2>Table {tableName}</h2>
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
            {showConsolidatedBill ? (
              <OutletConsolidatedBill
                consolidatedBill={consolidatedBill}
                setShowConsolidatedBill={setShowConsolidatedBill}
              />
            ) : (
              <OutletRegularBill
                tableInfo={tableInfo}
                refreshTables={refreshTables}
                setShowConsolidatedBill={setShowConsolidatedBill}
              />
            )}
            <p>Subtotal: ${(calculations.subtotal / 100).toFixed(2)}</p>
            <p>Tax: ${(calculations.tax / 100).toFixed(2)}</p>
            <p>Service Charge: ${(calculations.service / 100).toFixed(2)}</p>
            <p>Total: ${(calculations.total / 100).toFixed(2)}</p>
          </>
        ) : (
          <button
            onClick={() => {
              createRoom(tableNum, tableName);
            }}
          >
            Open Table
          </button>
        )}
      </div>
    </>
  );
}
