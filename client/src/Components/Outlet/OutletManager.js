import { useState, useEffect } from "react";
import OutletTable from "./OutletTable";

export default function OutletManager({accessLevel, socket}) {
    const [tableList, setTableList] = useState()
    const tableNumbers = [1,2,3,4,5,6,7,8,9,10]

    useEffect(()=>{
      getExistingTables()
    },[])
    
    async function getExistingTables() {
        const res = await fetch("/api/outlet/room", {
          method: "GET",
          credentials: "include",
        });
        let result = await res.json();
        if (res.ok) {
          setTableList(result.data);
          for (const x of result.data) {
            console.log("joining", x.room)
            socket.emit("joinRoom", {data: x.room})
          }
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
            body: JSON.stringify({tableNum: tableNum}),
          });
          let result = await res.json();
          if (res.ok) {
            console.log(result.data);
            socket.emit("joinRoom", {data: result.data})
            getExistingTables()
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
        body: JSON.stringify({orderId: orderId}),
      });
      let result = await res.json();
      if (res.ok) {
        console.log(orderId)
        let foundIndex = tableList.map(e => e._id).indexOf(orderId)
        let updatedTableList = tableList.map(e => e)
        updatedTableList.splice(foundIndex,1)
        console.log(updatedTableList)
        setTableList(updatedTableList)
      }
      console.log(result.data);
    }

    return(<>
        <h1>Outlet Manager</h1>
        {tableNumbers.map((tableNum, index) => <OutletTable key={index} tableNum={tableNum} tableList={tableList} createRoom={createRoom} closeRoom={closeRoom}/>)}
    </>)
}