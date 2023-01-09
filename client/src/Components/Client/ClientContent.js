import ClientEntry from "./ClientEntry"

export default function ClientContent({menuData, contentIndex}) {
    return(
        <>
            <h1>Content goes here</h1>
            <p>Current Index: {contentIndex}</p>
            {menuData.categories[contentIndex].entries.map((entryData) => <ClientEntry entryData={entryData}/>)}
        </>
    )
}