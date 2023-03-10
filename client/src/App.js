import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import io from "socket.io-client";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import Admin from "./Components/Admin/Admin";
import Profile from "./Components/Profile";
import OutletOverview from "./Components/Vendor/OutletOverview";
import MenuEditor from "./Components/Vendor/MenuEditor";
import Client from "./Components/Client/Client";
import ClientPreview from "./Components/Client/ClientPreview";
import OutletManager from "./Components/Outlet/OutletManager";
import OutletSettings from "./Components/Outlet/OutletSettings";
import FinanceManager from "./Components/Outlet/FinanceManager";
import config from "./config";
import Cookies from "js-cookie";

const socket = io(config.SERVER, { withCredentials: true });

function App() {
  const [accessLevel, setAccessLevel] = useState("loading");
  const [clientOverride, setClientOverride] = useState(false);

  useEffect(() => {
    async function verify() {
      const res = await fetch(`${config.SERVER}/api/user/verify`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        method: "GET",
        credentials: "include",
      });
      let result = await res.json();
      if (res.ok) {
        setAccessLevel(result.accessLevel);
      } else {
        setAccessLevel("notLoggedIn");
      }
    }
    verify();
  }, []);

  useEffect(() => {
    socket.on("connect", function () {
      console.log("Client is connected");
    });

    socket.on("message", function (message) {
      console.log(message);
    });

    return () => {
      socket.off("connect");
      socket.off("message");
    };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar
          accessLevel={accessLevel}
          setAccessLevel={setAccessLevel}
          clientOverride={clientOverride}
        />
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  accessLevel={accessLevel}
                  setAccessLevel={setAccessLevel}
                />
              }
            />
            <Route
              path="login"
              element={
                <Login
                  accessLevel={accessLevel}
                  setAccessLevel={setAccessLevel}
                />
              }
            />
            <Route path="admin" element={<Admin accessLevel={accessLevel} />} />
            <Route
              path="outletoverview"
              element={<OutletOverview accessLevel={accessLevel} />}
            />
            <Route
              path="menueditor"
              element={<MenuEditor accessLevel={accessLevel} />}
            />
            <Route
              path="outlet"
              element={
                <OutletManager accessLevel={accessLevel} socket={socket} />
              }
            />
            <Route
              path="outlet/finance"
              element={<FinanceManager accessLevel={accessLevel} />}
            />
            <Route
              path="outlet/settings"
              element={<OutletSettings accessLevel={accessLevel} />}
            />
            <Route
              path="profile"
              element={
                <Profile
                  accessLevel={accessLevel}
                  setAccessLevel={setAccessLevel}
                />
              }
            />
            <Route
              path="client/preview/:vendorid"
              element={
                <ClientPreview
                  setClientOverride={setClientOverride}
                  socket={socket}
                />
              }
            />
            <Route
              path="client/:roomid"
              element={
                <Client setClientOverride={setClientOverride} socket={socket} />
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
