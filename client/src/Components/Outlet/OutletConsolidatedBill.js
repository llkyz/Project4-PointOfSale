export default function OutletConsolidatedBill(
  {consolidatedBill,
  setShowConsolidatedBill}
) {
  return (
    <>
      <button
        onClick={() => {
          setShowConsolidatedBill(false);
        }}
      >
        Swap to Regular
      </button>
      <div style={{ border: "1px solid black" }}>
        {consolidatedBill.map((data, index) => {
          return (
            <p key={index}>
              {data.name} | {(data.price / 100).toFixed(2)} | {data.quantity} |{" "}
              {(data.lineTotal / 100).toFixed(2)}
            </p>
          );
        })}
      </div>
    </>
  );
}
