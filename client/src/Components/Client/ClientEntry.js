export default function ClientEntry({ entryData, index, setEntryIndex }) {
  return (
    <div
      className="clientEntry"
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
