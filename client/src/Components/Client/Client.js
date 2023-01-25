import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ClientContent from "./ClientContent";
import ClientMenu from "./ClientMenu";
import ClientEntryDetails from "./ClientEntryDetails";
import ClientCart from "./ClientCart";
import ClientBill from "./ClientBill";
import receipt from "../../Assets/receipt.png";
import cart from "../../Assets/cart.png";

export default function Client({ setClientOverride, socket }) {
  const [menuData, setMenuData] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [contentIndex, setContentIndex] = useState(0);
  const [entryIndex, setEntryIndex] = useState();
  const [currentOrder, setCurrentOrder] = useState({ roomid: "", items: [] });
  const [showCart, setShowCart] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
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

  function toggleMenu() {
    if (showMenu) {
      setShowMenu(false);
    } else {
      setShowBill(false);
      setShowCart(false);
      setShowMenu(true);
    }
  }

  function toggleCart() {
    if (showCart) {
      setEntryIndex();
      setShowCart(false);
    } else {
      setShowBill(false);
      setShowMenu(false);
      setShowCart(true);
    }
  }

  function toggleBill() {
    if (showBill) {
      setEntryIndex();
      setShowBill(false);
    } else {
      setShowCart(false);
      setShowMenu(false);
      setShowBill(true);
    }
  }

  return (
    <>
      <div className="clientNavbar">
        <div>
          <div className="clientNavbarMenuContainer" onClick={toggleMenu}>
            {menuData ? (
              <img className="clientNavbarIcon" src={menuData.logoUrl} />
            ) : (
              ""
            )}
          </div>
        </div>
        <div style={{ paddingRight: "5%" }}>
          <div
            className="clientNavbarIconContainer"
            style={{ marginRight: "10px" }}
            onClick={toggleCart}
          >
            <img className="clientNavbarIcon" src={cart} />
            {currentOrder.items.length > 0 ? (
              <div className="clientNavbarCartCount">
                {currentOrder.items.length}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="clientNavbarIconContainer" onClick={toggleBill}>
            <img className="clientNavbarIcon" src={receipt} />
          </div>
        </div>
      </div>
      <div className="clientContent">
        {errorMessage ? <h1>{errorMessage}</h1> : ""}
        {menuData ? (
          <>
            {showMenu ? (
              <ClientMenu
                menuData={menuData}
                setContentIndex={setContentIndex}
                setEntryIndex={setEntryIndex}
                setShowMenu={setShowMenu}
              />
            ) : (
              ""
            )}
            {showCart ? (
              <ClientCart
                currentOrder={currentOrder}
                setCurrentOrder={setCurrentOrder}
                menuData={menuData}
                socket={socket}
                roomid={params.roomid}
              />
            ) : (
              ""
            )}
            {showBill ? (
              <ClientBill menuData={menuData} roomid={params.roomid} />
            ) : (
              ""
            )}
            {!showMenu && !showCart && !showBill ? (
              entryIndex === undefined ? (
                <ClientContent
                  categoryData={menuData.categories[contentIndex]}
                  setEntryIndex={setEntryIndex}
                />
              ) : (
                <ClientEntryDetails
                  entryData={
                    menuData.categories[contentIndex].entries[entryIndex]
                  }
                  setEntryIndex={setEntryIndex}
                  currentOrder={currentOrder}
                  setCurrentOrder={setCurrentOrder}
                />
              )
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
