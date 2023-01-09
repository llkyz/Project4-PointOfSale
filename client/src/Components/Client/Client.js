import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ClientContent from './ClientContent';
import ClientNavbar from './ClientNavbar';

export default function Client({setClientOverride}) {
    const [menuData, setMenuData] = useState()
    const [errorMessage, setErrorMessage] = useState()
    const [contentIndex, setContentIndex] = useState(0)
    const params = useParams();

    useEffect(()=>{
        async function getMenu() {
            let res = await fetch(`/api/customer/menu/${params.vendorid}`, {
                method: "GET"
              });
              let result = await res.json();
              if (res.ok) {
                setMenuData(result.data);
                console.log("Menu Retrieved")
              } else {
                setErrorMessage(result.data);
              }
        }
        getMenu()
        setClientOverride(true)
        return () => {
            setClientOverride(false)
          };
    },[])

    return(<>
    <h1>Client</h1>
    {errorMessage ? <h1>{errorMessage}</h1> : ""}
    {menuData ? <>
        <ClientNavbar menuData={menuData} setContentIndex={setContentIndex}/>
        <ClientContent menuData={menuData} contentIndex={contentIndex}/>
    </> : ""}
    </>)
}