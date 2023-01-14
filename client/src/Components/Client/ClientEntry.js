export default function ClientEntry({ entryData, index, setEntryIndex }) {
  return (
    <div
      style={{ border: "1px solid black" }}
      onClick={() => {
        setEntryIndex(index);
      }}
    >
      <img src={entryData.imageUrl} alt={"food_image"} />
      <p>{entryData.name}</p>
      <p>${(entryData.price / 100).toFixed(2)}</p>
    </div>
  );
}
