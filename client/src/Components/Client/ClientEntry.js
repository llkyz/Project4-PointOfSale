export default function ClientEntry({entryData, index, setEntryIndex}) {
    return (
    <div style={{border: "1px solid black"}} onClick={()=>{setEntryIndex(index)}}>
        <img src={entryData.image ? `https://storage.cloud.google.com/pos-system/${entryData.image}` : `https://storage.cloud.google.com/pos-system/placeholder.jpg`}/>
        <p>{entryData.name}</p>
        <p>${entryData.price}</p>
    </div>
    )
}