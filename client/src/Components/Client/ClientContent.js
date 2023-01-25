import ClientEntry from "./ClientEntry";

export default function ClientContent({ categoryData, setEntryIndex }) {
  return (
    <>
      <h2 style={{ marginBottom: "10px" }}>{categoryData.name}</h2>
      <div
        className="separator"
        style={{ width: "90%", margin: "0 auto 10px auto" }}
      />
      {categoryData.entries.length === 0 ? (
        <h2>No entries found</h2>
      ) : (
        <div className="clientCategory">
          {categoryData.entries.map((entryData, index) => (
            <ClientEntry
              key={index}
              entryData={entryData}
              index={index}
              setEntryIndex={setEntryIndex}
            />
          ))}
        </div>
      )}
    </>
  );
}
