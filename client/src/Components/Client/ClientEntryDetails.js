import { useRef } from "react"

export default function ClientEntryDetails({entryData, setEntryIndex, currentOrder, setCurrentOrder}) {
    const ref = useRef()

    function increaseQuantity() {
        ref.current.value = parseInt(ref.current.value) + 1
    }

    function decreaseQuantity() {
        if (ref.current.value !== "0") {
            ref.current.value = parseInt(ref.current.value) - 1
        }
    }

    function addtoCart() {
        let updatedOrder = currentOrder
        updatedOrder.items.push({id: entryData._id, name: entryData.name, price: entryData.price, quantity: ref.current.value})
        localStorage.setItem("currentOrder", JSON.stringify(updatedOrder))
        setCurrentOrder(updatedOrder)
    }

    return (
        <div style={{border: "1px solid black"}}>
            <button onClick={()=>{setEntryIndex()}}>Back</button>
            <h1>Details</h1>
            <img src={entryData.image ? `https://storage.cloud.google.com/pos-system/${entryData.image}` : `https://storage.cloud.google.com/pos-system/placeholder.jpg`}/>
            <p>{entryData.name}</p>
            <p>${entryData.price}</p>
            <p>{entryData.description}</p>

            <button onClick={increaseQuantity}>Up</button>
            <input ref={ref} type="number" disabled={true} defaultValue={1}/>
            <button onClick={decreaseQuantity}>Down</button>
            <div><button onClick={addtoCart}>Add to cart</button></div>
        </div>
    )
}