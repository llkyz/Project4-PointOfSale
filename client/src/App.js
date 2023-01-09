import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import io from "socket.io-client";
import QRCode from "react-qr-code";
import uuid from "react-uuid";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import Register from "./Components/Register";
import Admin from "./Components/Admin/Admin";
import Outlet from "./Components/Outlet";
import Profile from "./Components/Profile/Profile";
import OutletOverview from "./Components/Vendor/OutletOverview";
import MenuEditor from "./Components/Vendor/MenuEditor";
import Client from "./Components/Client/Client";

const socket = io();

function App() {
  const pathname = window.location.pathname;
  const [data, setData] = useState({
    name: "",
    age: 0,
    date: "",
    programming: "",
  });
  const [qrcode, setQrcode] = useState();
  const [accessLevel, setAccessLevel] = useState("loading");
  const [clientOverride, setClientOverride] = useState(false)

  useEffect(() => {
    async function verify() {
      const res = await fetch("/api/user/verify", {
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

    socket.on("pong", function () {
      console.log("pong");
    });

    socket.on("randomKey", function (res) {
      console.log(res.data);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  function clickButton() {
    console.log("I clicked the button");
    socket.emit("clickButton", { data: "clicky" });
  }

  function ping() {
    socket.emit("ping");
  }

  function generateRandom() {
    socket.emit("generateRandom");
  }

  function generateQR() {
    const key = uuid();
    setQrcode(key);
  }

  useEffect(() => {
    fetch("/data")
      .then((res) => res.json())
      .then((data) => {
        setData({
          name: data.Name,
          age: data.Age,
          date: data.Date,
          programming: data.Programming,
        });
      });
  }, []);

  return (
    <div className="App">
      {/* <header className="App-header">
        <button onClick={clickButton}>Click me</button>
        <button onClick={ping}>PING!</button>
        <button onClick={generateRandom}>Generate</button>
        <button onClick={generateQR}>Make QR code</button>
        {qrcode ? <QRCode value={qrcode} size={200} /> : ""}
        <h1>React and Flask</h1>
        <p>{data.name}</p>
        <p>{data.age}</p>
        <p>{data.date}</p>
        <p>{data.programming}</p>
      </header> */}
      <BrowserRouter>
        <Navbar accessLevel={accessLevel} setAccessLevel={setAccessLevel} clientOverride={clientOverride}/>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home accessLevel={accessLevel} />} />
            <Route
              path="login"
              element={
                <Login
                  accessLevel={accessLevel}
                  setAccessLevel={setAccessLevel}
                />
              }
            />
            <Route path="register" element={<Register />} />
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
              element={<Outlet accessLevel={accessLevel} />}
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
            <Route path="client/:vendorid" element={<Client setClientOverride={setClientOverride}/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
