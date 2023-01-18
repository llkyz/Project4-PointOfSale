import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { doLogout } from "./functions";
import admin from "../Assets/admin.png";
import finance from "../Assets/finance.png";
import menu from "../Assets/menu.png";
import overview from "../Assets/overview.png";
import profile from "../Assets/profile.png";
import settings from "../Assets/settings.png";
import logo from "../Assets/logo.png";

export default function Home({ accessLevel, setAccessLevel }) {
  const navigate = useNavigate();

  return (
    <>
      <h1>Welcome to EasyPOS</h1>
      <div style={{ marginTop: "100px" }}>
        {accessLevel === "loading" ? <h2>Loading...</h2> : ""}
        {accessLevel === "notLoggedIn" ? (
          <>
            <img src={logo} style={{ width: "200px", marginTop: "100px" }} />
            <h2>
              Please{" "}
              <Link to="/login" style={{ textDecoration: "underline" }}>
                Login
              </Link>{" "}
              to access user features
            </h2>
          </>
        ) : (
          ""
        )}
        {accessLevel === "outlet" ? (
          <>
            <div>
              <Link to="/outlet">
                <div className="homeLink">
                  <div className="container">
                    <img src={overview} />
                    <h1>Outlet Manager</h1>
                  </div>
                  <div className="description">
                    Handle outlet operations. Open and close tables, manage
                    table orders, print bills.
                  </div>
                </div>
              </Link>
              <Link to="/outlet/finance">
                <div className="homeLink">
                  <div className="container">
                    <img src={finance} />
                    <h1>Finances</h1>
                  </div>
                  <div className="description">
                    Track monthly revenue and orders, remove erroneous
                    transactions from the archive.
                  </div>
                </div>
              </Link>
            </div>
            <Link to="/outlet/settings">
              <div className="homeLink">
                <div className="container">
                  <img src={settings} />
                  <h1>Outlet Settings</h1>
                </div>
                <div className="description">
                  <p>
                    Edit customer receipt information. Add and remove tables as
                    the layout of your outlet changes.
                  </p>
                </div>
              </div>
            </Link>
            <Link to="/profile">
              <div className="homeLink">
                <div className="container">
                  <img src={profile} />
                  <h1>Profile</h1>
                </div>
                <div className="description">
                  <p>Change your user ID or password.</p>
                </div>
              </div>
            </Link>
            <div
              className="logoutLink"
              onClick={() => {
                doLogout(setAccessLevel, navigate);
              }}
            >
              Log Out
            </div>
          </>
        ) : (
          ""
        )}
        {accessLevel === "vendor" ? (
          <>
            <div>
              <Link to="/outletoverview">
                <div className="homeLink">
                  <div className="container">
                    <img src={overview} />
                    <h1>Outlet Overview</h1>
                  </div>
                  <div className="description">
                    <p>Manage outlet information, track finances.</p>
                  </div>
                </div>
              </Link>
              <Link to="/menueditor">
                <div className="homeLink">
                  <div className="container">
                    <img src={menu} />
                    <h1>Menu Editor</h1>
                  </div>
                  <div className="description">
                    <p>
                      Edit tax and service charges, add and remove categories
                      and entries.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            <div>
              <Link to="/profile">
                <div className="homeLink">
                  <div className="container">
                    <img src={profile} />
                    <h1>Profile</h1>
                  </div>
                  <div className="description">
                    <p>Change your user ID or password.</p>
                  </div>
                </div>
              </Link>
            </div>
            <div
              className="logoutLink"
              onClick={() => {
                doLogout(setAccessLevel, navigate);
              }}
            >
              Log Out
            </div>
          </>
        ) : (
          ""
        )}
        {accessLevel === "admin" ? (
          <>
            <div>
              <Link to="/admin">
                <div className="homeLink">
                  <div className="container">
                    <img src={admin} />
                    <h1>User Panel</h1>
                  </div>
                  <div className="description">
                    <p>
                      Manage all users in the database. Add or remove users,
                      change passwords.
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/profile">
                <div className="homeLink">
                  <div className="container">
                    <img src={profile} />
                    <h1>Profile</h1>
                  </div>
                  <div className="description">
                    <p>Change your user ID or password.</p>
                  </div>
                </div>
              </Link>
            </div>
            <div
              className="logoutLink"
              onClick={() => {
                doLogout(setAccessLevel, navigate);
              }}
            >
              Log Out
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
