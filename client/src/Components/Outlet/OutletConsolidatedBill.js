export default function OutletConsolidatedBill({ consolidatedBill }) {
  return (
    <>
      <div className="billConsolidated">
        {consolidatedBill.map((data, index) => {
          return (
            <div className="billConsolidatedEntry" key={index}>
              <div>{data.quantity}</div>
              <div key={index}>{data.name}</div>
              <div>{(data.lineTotal / 100).toFixed(2)}</div>
              <div></div>
            </div>
          );
        })}
      </div>
    </>
  );
}
