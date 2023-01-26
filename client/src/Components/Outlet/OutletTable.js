import { useEffect, useState } from "react";
import OutletRegularBill from "./OutletRegularBill";
import OutletConsolidatedBill from "./OutletConsolidatedBill";
import table from "../../Assets/table.png";

export default function OutletTable({
  tableNum,
  tableName,
  tableList,
  menuData,
  createRoom,
  closeRoom,
  refreshTables,
  setPrintStatus,
  detailsIndex,
  setDetailsIndex,
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

  function toggleDetails() {
    if (detailsIndex === tableNum) {
      setDetailsIndex();
    } else {
      setDetailsIndex(tableNum);
    }
  }

  function toggleConsolidated() {
    if (showConsolidatedBill) {
      setShowConsolidatedBill(false);
    } else {
      setShowConsolidatedBill(true);
    }
  }

  if (detailsIndex !== undefined && detailsIndex !== tableNum) {
    return;
  } else {
    return (
      <>
        <div
          style={{
            position: "relative",
            display: detailsIndex === tableNum ? "block" : "inline-block",
            width: detailsIndex === tableNum ? "100%" : "23%",
            minWidth: "200px",
            border: detailsIndex === tableNum ? "" : "2px solid black",
            margin: "10px",
            backgroundColor:
              tableInfo && detailsIndex === undefined
                ? "rgb(222, 253, 168)"
                : "",
          }}
        >
          <div
            style={{
              cursor: "pointer",
              border: detailsIndex === tableNum ? "2px solid black" : "",
              marginBottom: detailsIndex === tableNum ? "20px" : "",
            }}
            onClick={toggleDetails}
          >
            <img src={table} style={{ height: "20px", marginRight: "10px" }} />
            <h2 style={{ display: "inline-block" }}>Table {tableName}</h2>
            {detailsIndex === tableNum ? (
              <div className="modalClose" style={{ top: "0", right: "15px" }}>
                x
              </div>
            ) : (
              ""
            )}
          </div>
          {detailsIndex === tableNum ? (
            <div style={{ marginLeft: "5%", marginRight: "5%" }}>
              {tableInfo ? (
                <>
                  <div
                    className="function"
                    style={{ marginRight: "20px", marginBottom: "10px" }}
                    onClick={() => {
                      setPrintStatus({ type: "qr", index: tableNum });
                    }}
                  >
                    Print QR Code
                  </div>
                  <div
                    className="function"
                    style={{ marginRight: "20px", marginBottom: "10px" }}
                    onClick={() => {
                      setPrintStatus({ type: "bill", index: tableNum });
                    }}
                  >
                    Print Bill
                  </div>
                  <div
                    className="function"
                    style={{ marginBottom: "10px" }}
                    onClick={() => {
                      closeRoom(tableInfo._id, consolidatedBill);
                    }}
                  >
                    Close Table
                  </div>
                  <h2>Time: {new Date(tableInfo.time).toLocaleTimeString()}</h2>
                  <div className="separator" />
                  <h2>Order List</h2>
                  <div
                    className="functionSmall"
                    style={{ marginBottom: "20px" }}
                    onClick={toggleConsolidated}
                  >
                    Swap to {showConsolidatedBill ? "Regular" : "Consolidated"}
                  </div>
                  <div className="billContainer">
                    <div className="billHeader">
                      <div>Qty</div>
                      <div>Item</div>
                      <div>Total</div>
                    </div>
                    {showConsolidatedBill ? (
                      <OutletConsolidatedBill
                        consolidatedBill={consolidatedBill}
                      />
                    ) : (
                      <OutletRegularBill
                        tableInfo={tableInfo}
                        refreshTables={refreshTables}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      maxWidth: "800px",
                      margin: "0 auto",
                      fontSize: "1.5em",
                    }}
                  >
                    <div style={{ marginBottom: "5px" }}>
                      Subtotal: {(calculations.subtotal / 100).toFixed(2)}
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                      Tax: {(calculations.tax / 100).toFixed(2)}
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                      Service Charge: {(calculations.service / 100).toFixed(2)}
                    </div>
                    <div style={{ marginBottom: "100px" }}>
                      Total:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {(calculations.total / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className="function"
                  onClick={() => {
                    createRoom(tableNum, tableName);
                  }}
                >
                  Open Table
                </div>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    );
  }
}
