import { useState, useEffect, useRef } from "react";
import OutletTable from "./OutletTable";
import NewOrders from "./NewOrders";
import PrintItem from "./PrintItem";
import overview from "../../Assets/overview.png";
import config from "../../config";
import Cookies from "js-cookie";

export default function OutletManager({ accessLevel, socket }) {
  const [menuData, setMenuData] = useState({
    service: 0,
    tax: 0,
    title: "Loading...",
  });
  const [outletData, setOutletData] = useState({
    name: "",
    address1: "",
    taxNum: "",
    telephone: "",
    fax: "",
    footer: "",
    tables: [],
  });
  const [tableList, setTableList] = useState();
  const tableListRef = useRef(tableList);
  const [newOrderList, setNewOrderList] = useState([]);
  const newOrderListRef = useRef(newOrderList);
  const [printStatus, setPrintStatus] = useState();
  const [detailsIndex, setDetailsIndex] = useState();

  useEffect(() => {
    async function initializeTables() {
      let data = await refreshTables();
      if (data) {
        for (const x of data) {
          console.log("Joining room", x.room);
          socket.emit("joinRoom", { data: x.room });
        }
      }
    }

    async function getMenuData() {
      const res = await fetch(`${config.SERVER}/api/outlet/menudata`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        method: "GET",
        credentials: "include",
      });
      let result = await res.json();
      if (res.ok) {
        setMenuData(result.data);
      } else {
        console.log(result.data);
      }
    }

    async function getOutletData() {
      const res = await fetch(`${config.SERVER}/api/outlet/setting`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        method: "GET",
        credentials: "include",
      });
      let result = await res.json();
      if (res.ok) {
        setOutletData(result.data);
      } else {
        console.log(result.data);
      }
    }

    initializeTables();
    getMenuData();
    getOutletData();

    socket.on("acknowledgeOrder", function (res) {
      let findIndex = tableListRef.current
        .map((e) => e.room)
        .indexOf(res.data.room);
      let updatedList = tableListRef.current.map((e) => e);
      let oldTime = tableListRef.current[findIndex].time;
      res.data.time = oldTime;
      updatedList.splice(findIndex, 1, res.data);
      setTableList(updatedList);
      tableListRef.current = updatedList;
      setNewOrderList([
        ...newOrderListRef.current,
        { tableName: res.data.tableName, items: res.items, time: new Date() },
      ]);
      newOrderListRef.current = [
        ...newOrderListRef.current,
        { tableName: res.data.tableName, items: res.items, time: new Date() },
      ];
      console.log("Order has been received");
    });

    return () => {
      socket.off("acknowledgeOrder");
    };
  }, [socket]);

  async function refreshTables() {
    const res = await fetch(`${config.SERVER}/api/outlet/room`, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      method: "GET",
      credentials: "include",
    });
    let result = await res.json();
    if (res.ok) {
      setTableList(result.data);
      tableListRef.current = result.data;
      return result.data;
    } else {
      console.log(result.data);
      return false;
    }
  }

  async function createRoom(tableNum, tableName) {
    const res = await fetch(`${config.SERVER}/api/outlet/room`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tableNum: tableNum, tableName: tableName }),
    });
    let result = await res.json();
    if (res.ok) {
      socket.emit("joinRoom", { data: result.data.room });
      setTableList([...tableList, result.data]);
      tableListRef.current = [...tableList, result.data];
    } else {
      console.log(result.data);
    }
  }

  async function closeRoom(orderId, consolidatedBill) {
    const res = await fetch(`${config.SERVER}/api/outlet/room`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId: orderId, orders: consolidatedBill }),
    });
    let result = await res.json();
    if (res.ok) {
      let foundIndex = tableList.map((e) => e._id).indexOf(orderId);
      let updatedTableList = tableList.map((e) => e);
      updatedTableList.splice(foundIndex, 1);
      setTableList(updatedTableList);
    }
    console.log(result.data);
  }

  return (
    <>
      {printStatus ? (
        <PrintItem
          tableList={tableList}
          newOrderList={newOrderList}
          printStatus={printStatus}
          menuData={menuData}
          outletData={outletData}
          setPrintStatus={setPrintStatus}
        />
      ) : (
        <>
          <div className="tables">
            <div className="pageHeader">
              <img src={overview} className="pageImage" alt="overview" />
              <div className="pageTitle">Outlet Manager</div>
            </div>
            {outletData.tables.map((tableName, index) => (
              <OutletTable
                key={index}
                tableNum={index}
                tableName={tableName}
                tableList={tableList}
                menuData={menuData}
                createRoom={createRoom}
                closeRoom={closeRoom}
                refreshTables={refreshTables}
                setPrintStatus={setPrintStatus}
                detailsIndex={detailsIndex}
                setDetailsIndex={setDetailsIndex}
              />
            ))}
          </div>
          <div className="newOrders">
            <NewOrders
              newOrderList={newOrderList}
              setNewOrderList={setNewOrderList}
              newOrderListRef={newOrderListRef}
              setPrintStatus={setPrintStatus}
            />
          </div>
        </>
      )}
    </>
  );
}
