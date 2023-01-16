import { useState } from "react"

export default function ArchiveEntry({entry, archiveIndex, deleteArchive}) {
    const [showDetails, setShowDetails] = useState(false)

    function toggleDetails() {
        if (showDetails) {
            setShowDetails(false)
        } else {
            setShowDetails(true)
        }
    }

    return(
        <div style={{border: '1px solid black'}} onClick={toggleDetails}>
        {showDetails ? <>
        <p>Qty | Item | Total</p>
        {entry.orders.map(item => <p>{item.quantity} {item.name} {(item.lineTotal/100).toFixed(2)}</p>)}
        <p>Subtotal: {(entry.subtotal / 100).toFixed(2)}</p>
        <p>Tax: {(entry.tax / 100).toFixed(2)}</p>
        <p>Service Charge: {(entry.service / 100).toFixed(2)}</p>
        <p>Total: {(entry.total / 100).toFixed(2)}</p>
        <button onClick={()=>{deleteArchive(entry._id, archiveIndex)}}>Delete Archive</button>
        </> : 
        <p>Date: {entry.time.toLocaleString()} | Table: {entry.tableName} | Total: {(entry.total / 100).toFixed(2)} </p>
        }
        </div>
      )
}