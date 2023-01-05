import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function NavbarMenu({
  setNavbarVisibility,
  navbarButtonRef,
  accessLevel,
  setAccessLevel,
}) {
  const wrapper = useRef();
  const navigate = useNavigate();
  useOutsideClick(wrapper, setNavbarVisibility, navbarButtonRef);

  function doLogout() {
    Cookies.remove("token");
    setAccessLevel("notLoggedIn");
    navigate("/");
  }

  return (
    <div className="navbar" ref={wrapper}>
      <div className="navbarTitle">
        <Link
          to="/"
          onClick={() => {
            setNavbarVisibility(false);
          }}
        >
          Easy POS
        </Link>
      </div>
      {accessLevel === "loading" || accessLevel === "notLoggedIn" ? (
        <div className="navbarLink">
          <Link
            to="/login"
            onClick={() => {
              setNavbarVisibility(false);
            }}
          >
            Login
          </Link>
        </div>
      ) : (
        ""
      )}
      {accessLevel === "loading" || accessLevel === "notLoggedIn" ? (
        <div className="navbarLink">
          <Link
            to="/register"
            onClick={() => {
              setNavbarVisibility(false);
            }}
          >
            Register
          </Link>
        </div>
      ) : (
        ""
      )}
      {accessLevel === "admin" ? (
        <div className="navbarLink">
          <Link
            to="/admin"
            onClick={() => {
              setNavbarVisibility(false);
            }}
          >
            Admin
          </Link>
        </div>
      ) : (
        ""
      )}
      {accessLevel === "vendor" || accessLevel === "admin" ? (
        <div className="navbarLink">
          <Link
            to="/vendor"
            onClick={() => {
              setNavbarVisibility(false);
            }}
          >
            Vendor
          </Link>
        </div>
      ) : (
        ""
      )}
      {accessLevel === "outlet" ||
      accessLevel === "vendor" ||
      accessLevel === "admin" ? (
        <div className="navbarLink">
          <Link
            to="/outlet"
            onClick={() => {
              setNavbarVisibility(false);
            }}
          >
            Outlet
          </Link>
        </div>
      ) : (
        ""
      )}
      {accessLevel !== "loading" && accessLevel !== "notLoggedIn" ? (
        <div className="navbarLink">
          <p onClick={doLogout}>Log Out</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

function useOutsideClick(ref, setNavbarVisibility, navbarButtonRef) {
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        ref.current &&
        !(
          ref.current.contains(event.target) ||
          navbarButtonRef.current.contains(event.target)
        )
      ) {
        setNavbarVisibility(false);
      }
    }
    document.addEventListener("mouseup", handleOutsideClick);
    return () => {
      document.removeEventListener("mouseup", handleOutsideClick);
    };
  }, [ref, setNavbarVisibility, navbarButtonRef]);
}
