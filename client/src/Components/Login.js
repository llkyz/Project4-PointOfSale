import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import logo from "../Assets/logo-white.png";
import config from "../../config";

export default function Login({ accessLevel, setAccessLevel }) {
  const [adminErrorMessage, setAdminErrorMessage] = useState();
  const [outletErrorMessage, setOutletErrorMessage] = useState();
  const [loginSelection, setLoginSelection] = useState("outlet");
  const [savedAdminLogin, setSavedAdminLogin] = useState();
  const [savedOutletLogin, setSavedOutletLogin] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    function getSavedLogin() {
      const adminCookie = Cookies.get("adminLogin");
      let outletCookie = "";
      if (Cookies.get("outletLogin")) {
        outletCookie = JSON.parse(Cookies.get("outletLogin"));
      }
      if (adminCookie) {
        setSavedAdminLogin(adminCookie);
      }
      if (outletCookie) {
        setSavedOutletLogin(outletCookie);
      }
    }
    getSavedLogin();
  }, []);

  useEffect(() => {
    if (accessLevel !== "loading" && accessLevel !== "notLoggedIn") {
      navigate("/");
    }
  }, [accessLevel, navigate]);

  async function doAdminLogin(event) {
    event.preventDefault();
    let formBody = {
      username: event.target.form[0].value,
      password: event.target.form[1].value,
    };
    const res = await fetch(config.SERVER + "/api/user/adminlogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
    });
    let result = await res.json();
    if (res.ok) {
      Cookies.set("token", result.token, { expires: 90 });
      setAccessLevel(result.accessLevel);
      if (event.target.form[2].checked) {
        Cookies.set("adminLogin", formBody.username, { expires: 90 });
      }
      navigate("/");
    } else {
      setAdminErrorMessage(result.data);
    }
  }

  async function doOutletLogin(event) {
    event.preventDefault();
    let formBody = {
      vendor: event.target.form[0].value,
      username: event.target.form[1].value,
      password: event.target.form[2].value,
    };
    const res = await fetch(config.SERVER + "/api/user/outletlogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
    });
    let result = await res.json();
    if (res.ok) {
      Cookies.set("token", result.token, { expires: 90 });
      setAccessLevel(result.accessLevel);
      if (event.target.form[3].checked) {
        Cookies.set(
          "outletLogin",
          JSON.stringify({
            vendor: formBody.vendor,
            username: formBody.username,
          }),
          { expires: 90 }
        );
      }
      navigate("/");
    } else {
      setOutletErrorMessage(result.data);
    }
  }

  return (
    <>
      <div className="loginModal">
        <div className="loginSide">
          <div className="loginTitle">
            <img
              src={logo}
              style={{
                width: "20%",
                display: "inline-block",
                marginRight: "30px",
              }}
            />
            <h1
              className="logoName"
              style={{ display: "inline-block", fontSize: "3em" }}
            >
              EasyPOS
            </h1>
            <h4>SERVICE WITH A SINGLE CLICK</h4>
            <p>
              Make your menu, connect with customers, manage your outlets, and
              handle your finances - all on a one-stop platform.
            </p>
          </div>
        </div>
        <div className="loginSide2">
          <Link to="/" className="loginClose">
            x
          </Link>
          <div style={{ width: "70%", margin: "0 auto" }}>
            <h1>Log In</h1>
            <div className="loginOptionContainer">
              <div
                onClick={() => {
                  setLoginSelection("admin");
                }}
                className={
                  loginSelection === "admin"
                    ? "loginOptionSelected"
                    : "loginOption"
                }
              >
                Admin
              </div>
              <div
                onClick={() => {
                  setLoginSelection("outlet");
                }}
                className={
                  loginSelection === "outlet"
                    ? "loginOptionSelected"
                    : "loginOption"
                }
              >
                Outlet
              </div>
            </div>
            {loginSelection === "outlet" ? (
              <OutletLogin
                outletErrorMessage={outletErrorMessage}
                savedOutletLogin={savedOutletLogin}
                doOutletLogin={doOutletLogin}
              />
            ) : (
              <AdminLogin
                adminErrorMessage={adminErrorMessage}
                savedAdminLogin={savedAdminLogin}
                doAdminLogin={doAdminLogin}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function AdminLogin({ adminErrorMessage, savedAdminLogin, doAdminLogin }) {
  return (
    <div className="loginElement">
      {adminErrorMessage ? (
        <div className="error">{adminErrorMessage}</div>
      ) : (
        ""
      )}
      <form>
        <div>
          <div>User ID</div>
          <input
            className="loginInput"
            type="text"
            defaultValue={savedAdminLogin ?? ""}
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <div>Password</div>
          <input className="loginInput" type="password" />
        </div>
        <label className="loginCheckbox" style={{ marginTop: "20px" }}>
          <input type="checkbox" />
          <span className="checkmark" />
          Remember my login info
        </label>
        <div>
          <input
            className="loginButton"
            type="submit"
            value="LOG IN"
            onClick={(event) => doAdminLogin(event)}
          />
        </div>
      </form>
    </div>
  );
}

function OutletLogin({ outletErrorMessage, savedOutletLogin, doOutletLogin }) {
  return (
    <div className="loginElement">
      {outletErrorMessage ? (
        <div className="error">{outletErrorMessage}</div>
      ) : (
        ""
      )}
      <form>
        <div>
          <div>Vendor ID</div>
          <input
            className="loginInput"
            type="text"
            defaultValue={savedOutletLogin ? savedOutletLogin.vendor : ""}
          />
        </div>
        <div style={{ marginTop: "0px" }}>
          <div>Outlet ID</div>
          <input
            className="loginInput"
            type="text"
            defaultValue={savedOutletLogin ? savedOutletLogin.username : ""}
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <div>Password</div>
          <input className="loginInput" type="password" />
        </div>
        <label className="loginCheckbox" style={{ marginTop: "20px" }}>
          <input type="checkbox" />
          <span className="checkmark" />
          Remember my login info
        </label>
        <div>
          <input
            className="loginButton"
            type="submit"
            value="LOG IN"
            onClick={(event) => doOutletLogin(event)}
          />
        </div>
      </form>
    </div>
  );
}
