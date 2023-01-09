export default function ClientEntry({ entryData, index, setEntryIndex }) {
  return (
    <div
      style={{ border: "1px solid black" }}
      onClick={() => {
        setEntryIndex(index);
      }}
    >
      <img src={entryData.image} />
      <p>{entryData.name}</p>
      <p>${entryData.price}</p>
    </div>
  );
}
