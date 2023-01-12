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
  }, []);

  useEffect(() => {
    if (billData) {
      let subtotal = 0;
      billData.forEach((entry) => {
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
  }, [billData]);

  useEffect(() => {
    function conslidateOrders() {
      let newList = [];
      console.log(billData);
      billData.forEach((order) => {
        order.forEach((item) => {
          newList.push(item);
        });
      });
      console.log(newList);
    }
    conslidateOrders();
  }, [billData]);

  return (
    <>
      <h1>Total Bill</h1>
      {!billData ? (
        "Loading..."
      ) : (
        <div>
          {billData.map((entry) => {
            return (
              <div style={{ border: "1px solid black" }}>
                {entry.map((item) => {
                  return (
                    <p>
                      {item.name} | ${item.price.toFixed(2)} | {item.quantity} |
                      ${item.lineTotal.toFixed(2)}
                    </p>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
      <div>
        <p>Subtotal: ${calculations.subtotal.toFixed(2)}</p>
        <p>
          Tax ({menuData.tax}%): ${calculations.tax.toFixed(2)}
        </p>
        <p>
          Service Charge ({menuData.service}%): $
          {calculations.service.toFixed(2)}
        </p>
        <p>Total: ${calculations.total.toFixed(2)}</p>
      </div>
    </>
  );
}
