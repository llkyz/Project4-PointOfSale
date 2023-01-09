import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
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
  const [currentOrder, setCurrentOrder] = useState({ vendorid: "", items: [] });
  const [totalBill, setTotalBill] = useState();
  const [showCart, setShowCart] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const params = useParams();

  useEffect(() => {
    async function getMenu() {
      let res = await fetch(`/api/customer/menu/${params.vendorid}`, {
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
        if (storageCheck.vendorid === params.vendorid) {
          setCurrentOrder(storageCheck);
        } else {
          createLocalStorage();
        }
      } else {
        createLocalStorage();
      }
    }
    getMenu();
    checkLocalStorage();
    setClientOverride(true);
    return () => {
      setClientOverride(false);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("currentOrder", JSON.stringify(currentOrder));
  }, [currentOrder]);

  function createLocalStorage() {
    localStorage.setItem(
      "currentOrder",
      JSON.stringify({ vendorid: params.vendorid, items: [] })
    );
  }

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
              socket={socket}
            />
          ) : showBill ? (
            <ClientBill />
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
