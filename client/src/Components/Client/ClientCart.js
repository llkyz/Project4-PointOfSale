import { useState, useEffect } from "react"
import io from "socket.io-client";

export default function ClientCart({currentOrder, menuData, setShowCart}) {
    const socket = io();
    const [calculations, setCalculations] = useState({subtotal: 0, tax: 0, service: 0, total: 0})

    useEffect(()=>{
        function doCalculations() {
            let subtotal = 0
            for (let x of currentOrder.items) {
                subtotal += parseFloat(x.price) * parseInt(x.quantity)
            }
            subtotal = parseFloat(subtotal.toFixed(2))
            const tax = parseFloat((subtotal * menuData.tax / 100).toFixed(2))
            const service = parseFloat((subtotal * menuData.service / 100).toFixed(2))
            const total = parseFloat((subtotal + tax + service).toFixed(2))
            setCalculations({subtotal: subtotal, tax: tax, service: service, total: total})
        }
        doCalculations()
    },[currentOrder])

    function sendOrder() {
        console.log("Order sent");
        socket.emit("sendOrder", { data: "clicky" });
      }

    return (
        <>
        <h1>Order List</h1>
        <button onClick={()=>{setShowCart(false)}}>Back</button>
        <div style={{border: "1px solid black"}}>
            {currentOrder.items.map((data, index)=><p key={index}>{data.name}, ${data.price} x{data.quantity}: ${(parseFloat(data.price) * parseInt(data.quantity)).toFixed(2)}</p>)}
        </div>
        <p>Subtotal: {calculations.subtotal}</p>
        <p>Tax ({menuData.tax}%): {calculations.tax}</p>
        <p>Service Charge ({menuData.service}%): {calculations.service}</p>
        <p>Total: {calculations.total}</p>
        <div><button onClick={sendOrder}>Send Order</button></div>
        </>
    )
}