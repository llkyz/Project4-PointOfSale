import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ClientContent from "./ClientContent";
import ClientNavbar from "./ClientNavbar";
import ClientEntryDetails from "./ClientEntryDetails";
import ClientCart from "./ClientCart";
import ClientBill from "./ClientBill";

export default function Client({ setClientOverride, socket }) {
  const [menuData, setMenuData] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [contentIndex, setContentIndex] = useState(0);
  const [entryIndex, setEntryIndex] = useState();
  const [currentOrder, setCurrentOrder] = useState({ roomid: "", items: [] });
  const [showCart, setShowCart] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const params = useParams();

  useEffect(() => {
    async function getMenu() {
      let res = await fetch(`/api/customer/menu/${params.roomid}`, {
        method: "GET",
      });
      let result = await res.json();
      if (res.ok) {
        setMenuData(result.data);
        console.log("Menu Retrieved");
      } else {
        setErrorMessage(result.data);
      }
    }

    async function checkLocalStorage() {
      const storageCheck = JSON.parse(localStorage.getItem("currentOrder"));
      if (storageCheck) {
        if (storageCheck.roomid === params.roomid) {
          setCurrentOrder(storageCheck);
        } else {
          createNewStorage();
        }
      } else {
        createNewStorage();
      }
    }

    function createNewStorage() {
      setCurrentOrder({ roomid: params.roomid, items: [] });
      localStorage.setItem(
        "currentOrder",
        JSON.stringify({ roomid: params.roomid, items: [] })
      );
    }
    getMenu();
    checkLocalStorage();
    setClientOverride(true);
    socket.emit("joinRoom", { data: params.roomid });
    return () => {
      setClientOverride(false);
    };
  }, [params.roomid, setClientOverride, socket]);

  useEffect(() => {
    localStorage.setItem("currentOrder", JSON.stringify(currentOrder));
  }, [currentOrder]);

  return (
    <>
      <h1>Client</h1>
      {errorMessage ? <h1>{errorMessage}</h1> : ""}
      <div className="orderBar">
        <div
          onClick={() => {
            setShowBill(false);
            setShowCart(true);
          }}
        >
          Cart: {currentOrder.items.length}
        </div>
        <div
          onClick={() => {
            setShowBill(true);
            setShowCart(false);
          }}
        >
          Bill
        </div>
      </div>
      {menuData ? (
        <>
          <ClientNavbar menuData={menuData} setContentIndex={setContentIndex} />
          {showCart ? (
            <ClientCart
              currentOrder={currentOrder}
              setCurrentOrder={setCurrentOrder}
              menuData={menuData}
              setShowCart={setShowCart}
              setEntryIndex={setEntryIndex}
              socket={socket}
              roomid={params.roomid}
            />
          ) : showBill ? (
            <ClientBill
              menuData={menuData}
              roomid={params.roomid}
              setShowBill={setShowBill}
              setEntryIndex={setEntryIndex}
            />
          ) : entryIndex === undefined ? (
            <ClientContent
              categoryData={menuData.categories[contentIndex]}
              setEntryIndex={setEntryIndex}
            />
          ) : (
            <ClientEntryDetails
              entryData={menuData.categories[contentIndex].entries[entryIndex]}
              setEntryIndex={setEntryIndex}
              currentOrder={currentOrder}
              setCurrentOrder={setCurrentOrder}
            />
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
}
