import { useState, useEffect } from "react";

export default function ClientBill({
  menuData,
  roomid,
  setShowBill,
  setEntryIndex,
}) {
  const [billData, setBillData] = useState();
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    tax: 0,
    service: 0,
    total: 0,
  });
  const [consolidatedBill, setConsolidatedBill] = useState();

  useEffect(() => {
    async function getBillData() {
      const res = await fetch(`/api/customer/bill/${roomid}`, {
        method: "GET",
        credentials: "include",
      });
      let result = await res.json();
      if (res.ok) {
        setBillData(result.data);
      } else {
        console.log(result.data);
      }
    }
    getBillData();
  }, [roomid]);

  useEffect(() => {
    function conslidateOrdersAndCalculate() {
      let consolidatedList = [];
      billData.forEach((order) => {
        order.forEach((item) => {
          let findIndex = consolidatedList
            .map((e) => e.name)
            .indexOf(item.name);
          if (findIndex !== -1) {
            consolidatedList[findIndex].lineTotal += item.lineTotal;
            consolidatedList[findIndex].quantity += item.quantity;
          } else {
            consolidatedList.push(item);
          }
        });
      });
      setConsolidatedBill(consolidatedList);

      let subtotal = 0;
      consolidatedList.forEach((item) => {
        subtotal += item.lineTotal;
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
    if (billData) {
      conslidateOrdersAndCalculate();
    }
  }, [billData, menuData.service, menuData.tax]);

  return (
    <>
      <h1>Total Bill</h1>
      <button
        onClick={() => {
          setShowBill(false);
          setEntryIndex();
        }}
      >
        Back
      </button>
      {!consolidatedBill ? (
        "Loading..."
      ) : (
        <div style={{ border: "1px solid black" }}>
          {consolidatedBill.map((item, index) => {
            return (
              <p key={index}>
                {item.name} | ${(item.price / 100).toFixed(2)} | {item.quantity}{" "}
                | ${(item.lineTotal / 100).toFixed(2)}
              </p>
            );
          })}
        </div>
      )}
      <div>
        <p>Subtotal: ${(calculations.subtotal / 100).toFixed(2)}</p>
        <p>
          Tax ({menuData.tax}%): ${(calculations.tax / 100).toFixed(2)}
        </p>
        <p>
          Service Charge ({menuData.service}%): $
          {(calculations.service / 100).toFixed(2)}
        </p>
        <p>Total: ${(calculations.total / 100).toFixed(2)}</p>
      </div>
    </>
  );
}
