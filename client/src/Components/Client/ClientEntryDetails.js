import { useRef } from "react";

export default function ClientEntryDetails({
  entryData,
  setEntryIndex,
  currentOrder,
  setCurrentOrder,
}) {
  const ref = useRef();

  function increaseQuantity() {
    ref.current.value = parseInt(ref.current.value) + 1;
  }

  function decreaseQuantity() {
    if (ref.current.value !== "0") {
      ref.current.value = parseInt(ref.current.value) - 1;
    }
  }

  function addtoCart() {
    let updatedItemList = currentOrder.items;
    updatedItemList.push({
      id: entryData._id,
      name: entryData.name,
      price: entryData.price,
      quantity: ref.current.value,
    });
    setCurrentOrder({ ...currentOrder, items: updatedItemList });
  }

  return (
    <div style={{ border: "1px solid black" }}>
      <button
        onClick={() => {
          setEntryIndex();
        }}
      >
        Back
      </button>
      <h1>Details</h1>
      <img src={entryData.image} />
      <p>{entryData.name}</p>
      <p>${entryData.price}</p>
      <p>{entryData.description}</p>

      <button onClick={increaseQuantity}>Up</button>
      <input ref={ref} type="number" disabled={true} defaultValue={1} />
      <button onClick={decreaseQuantity}>Down</button>
      <div>
        <button onClick={addtoCart}>Add to cart</button>
      </div>
    </div>
  );
}
