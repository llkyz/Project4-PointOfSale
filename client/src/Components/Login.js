import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

export default function Login({ accessLevel, setAccessLevel }) {
  const [adminErrorMessage, setAdminErrorMessage] = useState();
  const [outletErrorMessage, setOutletErrorMessage] = useState();
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
    const res = await fetch("/api/user/adminlogin", {
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
    const res = await fetch("/api/user/outletlogin", {
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
      <h1>Login</h1>
      <div className="loginElement">
        <h2>Admin Login</h2>
        {adminErrorMessage ? <h2>{adminErrorMessage}</h2> : ""}
        <form>
          <div>
            <label>User ID</label>
            <input
              type="text"
              placeholder="User ID"
              defaultValue={savedAdminLogin ?? ""}
            />
          </div>
          <div>
            <label>Password</label>
            <input type="password" placeholder="Password" />
          </div>
          <div>
            <label htmlFor="remember">Remember Login</label>
            <input type="checkbox" />
          </div>
          <div>
            <input
              type="submit"
              value="Log In"
              onClick={(event) => doAdminLogin(event)}
            />
          </div>
        </form>
      </div>
      <div className="loginElement">
        <h2>Outlet Login</h2>
        {outletErrorMessage ? <h2>{outletErrorMessage}</h2> : ""}
        <form>
          <div>
            <label>Vendor ID</label>
            <input
              type="text"
              placeholder="Vendor ID"
              defaultValue={savedOutletLogin ? savedOutletLogin.vendor : ""}
            />
          </div>
          <div>
            <label>Outlet ID</label>
            <input
              type="text"
              placeholder="Outlet ID"
              defaultValue={savedOutletLogin ? savedOutletLogin.username : ""}
            />
          </div>
          <div>
            <label>Password</label>
            <input type="password" placeholder="Password" />
          </div>
          <div>
            <label htmlFor="remember">Remember Login</label>
            <input type="checkbox" />
          </div>
          <div>
            <input
              type="submit"
              value="Log In"
              onClick={(event) => doOutletLogin(event)}
            />
          </div>
        </form>
      </div>
    </>
  );
}
