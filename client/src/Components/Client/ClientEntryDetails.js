import { useRef, useState } from "react";

export default function ClientEntryDetails({
  entryData,
  setEntryIndex,
  currentOrder,
  setCurrentOrder,
}) {
  const ref = useRef();
  const [added, setAdded] = useState(false);

  function increaseQuantity() {
    ref.current.innerHTML = parseInt(ref.current.innerHTML) + 1;
  }

  function decreaseQuantity() {
    if (ref.current.innerHTML !== "1") {
      ref.current.innerHTML = parseInt(ref.current.innerHTML) - 1;
    }
  }

  function addtoCart() {
    let updatedItemList = currentOrder.items;
    let duplicateCheck = updatedItemList
      .map((e) => e.name)
      .indexOf(entryData.name);
    if (duplicateCheck === -1) {
      updatedItemList.push({
        name: entryData.name,
        price: parseFloat(entryData.price),
        quantity: parseInt(ref.current.innerHTML),
        lineTotal: parseFloat(
          (
            parseFloat(entryData.price) * parseInt(ref.current.innerHTML)
          ).toFixed(2)
        ),
      });
    } else {
      updatedItemList[duplicateCheck].quantity += parseInt(
        ref.current.innerHTML
      );
      updatedItemList[duplicateCheck].lineTotal = parseFloat(
        (
          updatedItemList[duplicateCheck].price *
          updatedItemList[duplicateCheck].quantity
        ).toFixed(2)
      );
    }
    setCurrentOrder({ ...currentOrder, items: updatedItemList });
    setAdded(true);

    const myTimeout = setTimeout(() => {
      setAdded(false);
    }, 1000);
  }

  return (
    <div className="clientEntryDetails">
      <div
        className="functionSmallMobile"
        style={{ display: "block" }}
        onClick={() => {
          setEntryIndex();
        }}
      >
        ← Back
      </div>
      <h2>{entryData.name}</h2>
      <img src={entryData.imageUrl} alt={"food_image"} />
      <p>{entryData.description}</p>
      <h3>${(entryData.price / 100).toFixed(2)}</h3>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "30px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="clientArrowContainer">
            <div className="sortUp" onClick={increaseQuantity} />
            <div style={{ height: "10px" }} />
            <div className="sortDown" onClick={decreaseQuantity} />
          </div>
          <div
            style={{
              display: "inline-block",
              fontSize: "1.2em",
            }}
          >
            Qty:{" "}
            <span ref={ref} style={{ fontWeight: "bold" }}>
              1
            </span>
          </div>
        </div>
        <div>
          {added ? (
            <div className="functionSmallDisabled">Item Added</div>
          ) : (
            <div className="functionSmallMobile" onClick={addtoCart}>
              Add to cart
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
