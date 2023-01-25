import { useState, useEffect } from "react";

export default function ClientBill({ menuData, roomid }) {
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
    <div style={{ width: "90%", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "10px" }}>Total Bill</h2>
      <div className="separator" style={{ marginBottom: "10px" }}></div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "15% auto 20%",
          textAlign: "left",
          marginBottom: "10px",
        }}
      >
        <div style={{ fontWeight: "bold" }}>Qty</div>
        <div style={{ fontWeight: "bold" }}>Item</div>
        <div style={{ fontWeight: "bold", textAlign: "right" }}>Total</div>
      </div>
      {!consolidatedBill ? (
        <h3>Loading...</h3>
      ) : (
        <>
          {consolidatedBill.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "15% auto 20%",
                  textAlign: "left",
                }}
              >
                <div>{item.quantity}</div>
                <div>{item.name}</div>
                <div style={{ textAlign: "right" }}>
                  ${(item.lineTotal / 100).toFixed(2)}
                </div>
              </div>
            );
          })}
        </>
      )}
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
    </div>
  );
}
