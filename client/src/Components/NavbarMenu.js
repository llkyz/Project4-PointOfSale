import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doLogout } from "./functions";
import home from "../Assets/home.png";

export default function NavbarMenu({
  setNavbarVisibility,
  navbarButtonRef,
  accessLevel,
  setAccessLevel,
}) {
  const wrapper = useRef();
  const navigate = useNavigate();
  useOutsideClick(wrapper, setNavbarVisibility, navbarButtonRef);

  return (
    <div className="navbar" ref={wrapper}>
      <Link
        to="/"
        onClick={() => {
          setNavbarVisibility(false);
        }}
      >
        <img src={home} />
      </Link>

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
      {accessLevel === "admin" ? (
        <div className="navbarLink">
          <Link
            to="/admin"
            onClick={() => {
              setNavbarVisibility(false);
            }}
          >
            Admin User Panel
          </Link>
        </div>
      ) : (
        ""
      )}
      {accessLevel === "vendor" ? (
        <>
          <div className="navbarLink">
            <Link
              to="/outletoverview"
              onClick={() => {
                setNavbarVisibility(false);
              }}
            >
              Overview
            </Link>
          </div>
          <div className="navbarLink">
            <Link
              to="/menueditor"
              onClick={() => {
                setNavbarVisibility(false);
              }}
            >
              Menu Editor
            </Link>
          </div>
        </>
      ) : (
        ""
      )}
      {accessLevel === "outlet" ? (
        <>
          <div className="navbarLink">
            <Link
              to="/outlet"
              onClick={() => {
                setNavbarVisibility(false);
              }}
            >
              Outlet Manager
            </Link>
          </div>
          <div className="navbarLink">
            <Link
              to="/outlet/finance"
              onClick={() => {
                setNavbarVisibility(false);
              }}
            >
              Finances
            </Link>
          </div>
          <div className="navbarLink">
            <Link
              to="/outlet/settings"
              onClick={() => {
                setNavbarVisibility(false);
              }}
            >
              Outlet Settings
            </Link>
          </div>
        </>
      ) : (
        ""
      )}
      {accessLevel !== "loading" && accessLevel !== "notLoggedIn" ? (
        <>
          <div className="navbarLink">
            <Link
              to="/profile"
              onClick={() => {
                setNavbarVisibility(false);
              }}
            >
              Profile
            </Link>
          </div>
          <div className="navbarLink">
            <p
              style={{ cursor: "pointer" }}
              onClick={() => {
                doLogout(setAccessLevel, navigate);
                setNavbarVisibility(false);
              }}
            >
              Log Out
            </p>
          </div>
        </>
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
