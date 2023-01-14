import { useState, useEffect, useRef } from "react";
import OutletTable from "./OutletTable";

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

  useEffect(() => {
    async function initializeTables() {
      const res = await fetch("/api/outlet/room", {
        method: "GET",
        credentials: "include",
      });
      let result = await res.json();
      if (res.ok) {
        setTableList(result.data);
        tableListRef.current = result.data;
        for (const x of result.data) {
          console.log("Joining room", x.room);
          socket.emit("joinRoom", { data: x.room });
        }
      } else {
        console.log(result.data);
      }
    }

    async function getMenuData() {
      const res = await fetch("/api/outlet/menudata", {
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
      const res = await fetch("/api/outlet/setting", {
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
      console.log("Order has been received");
    });

    return () => {
      socket.off("acknowledgeOrder");
    };
  }, [socket]);

  async function createRoom(tableNum, tableName) {
    const res = await fetch("/api/outlet/room", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tableNum: tableNum, tableName: tableName }),
    });
    let result = await res.json();
    if (res.ok) {
      socket.emit("joinRoom", { data: result.data.room });
      setTableList([...tableList, result.data]);
    } else {
      console.log(result.data);
    }
  }

  async function closeRoom(orderId) {
    const res = await fetch("/api/outlet/room", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId: orderId }),
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
      <h1>Outlet Manager</h1>
      {outletData.tables.map((tableName, index) => (
        <OutletTable
          key={index}
          tableNum={index}
          tableName={tableName}
          tableList={tableList}
          menuData={menuData}
          createRoom={createRoom}
          closeRoom={closeRoom}
        />
      ))}
    </>
  );
}
