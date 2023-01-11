import { useState, useEffect, useRef } from "react";
import OutletTable from "./OutletTable";

export default function OutletManager({ accessLevel, socket }) {
  const [menuData, setMenuData] = useState({
    service: 0,
    tax: 0,
    title: "Loading...",
  });
  const [tableList, setTableList] = useState();
  const tableListRef = useRef(tableList);
  const tableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    async function initializeTables() {
      const joinData = await getExistingTables();
      for (const x of joinData) {
        console.log("joining", x.room);
        socket.emit("joinRoom", { data: x.room });
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

    initializeTables();
    getMenuData();

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
  }, []);

  async function getExistingTables() {
    const res = await fetch("/api/outlet/room", {
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
    }
  }

  async function createRoom(tableNum) {
    const res = await fetch("/api/outlet/room", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tableNum: tableNum }),
    });
    let result = await res.json();
    if (res.ok) {
      console.log(result.data);
      socket.emit("joinRoom", { data: result.data });
      getExistingTables();
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
      {tableNumbers.map((tableNum, index) => (
        <OutletTable
          key={index}
          tableNum={tableNum}
          tableList={tableList}
          menuData={menuData}
          createRoom={createRoom}
          closeRoom={closeRoom}
        />
      ))}
    </>
  );
}