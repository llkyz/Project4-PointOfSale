import ClientEntry from "./ClientEntry"

export default function ClientContent({categoryData, setEntryIndex}) {
    return(
        <>
            <h1>Content goes here</h1>
            {categoryData.entries.map((entryData, index) => <ClientEntry key={index} entryData={entryData} index={index} setEntryIndex={setEntryIndex}/>)}
        </>
    )
}