import { useEffect, useState } from "react"
import QRCode from "react-qr-code";

export default function OutletTable({tableNum, tableList, createRoom, closeRoom}) {
    const [tableIndex, setTableIndex] = useState()
    const [tableInfo, setTableInfo] = useState()

    useEffect(()=>{
        if (tableList) {
            let foundIndex = tableList.map(e => e.table).indexOf(tableNum)
            if (foundIndex != -1) {
                setTableInfo(tableList[foundIndex])
            } else {
                setTableInfo()
            }
        }
    },[tableList])

    return(
        <div style={{border: "1px solid black"}}>
            <h2>Table {tableNum}</h2>
        
        {tableInfo ? <>
            <QRCode value={`localhost:3000/client/${tableInfo.room}`} size={200} />
            <button onClick={()=>{closeRoom(tableInfo._id)}}>Close Table</button>
            <h4>Order List</h4>
            {tableInfo.orders.map((data) => {return(
            <div>
                {JSON.stringify(data)}
            </div>)})}
        </> : 
        <button onClick={()=>{createRoom(tableNum)}}>Open Table</button>}
        </div>
    )
}