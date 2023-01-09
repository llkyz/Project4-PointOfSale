export default function ClientNavbar({menuData, setContentIndex}) {
    return (<>
    <h4>Navbar</h4>
    {menuData.categories.map((data, index) => {
        return (<button key={index} onClick={()=>{setContentIndex(index)}}>{data.name}</button>)
    })}
    </>)
}