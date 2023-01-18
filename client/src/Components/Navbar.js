import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import NavbarMenu from "./NavbarMenu";
import home from "../Assets/home.png";

export default function Navbar({
  accessLevel,
  setAccessLevel,
  clientOverride,
}) {
  const [navbarVisibility, setNavbarVisibility] = useState(false);
  const navbarButtonRef = useRef();

  function toggleVisibility() {
    if (navbarVisibility) {
      setNavbarVisibility(false);
    } else {
      setNavbarVisibility(true);
    }
  }

  if (clientOverride) {
    return;
  }

  return (
    <>
      <div
        onClick={toggleVisibility}
        ref={navbarButtonRef}
        className="navbarButton"
      />
      <Link
        className="home"
        to="/"
        onClick={() => {
          setNavbarVisibility(false);
        }}
      >
        <img src={home} />
      </Link>
      {navbarVisibility ? (
        <NavbarMenu
          setNavbarVisibility={setNavbarVisibility}
          navbarButtonRef={navbarButtonRef}
          accessLevel={accessLevel}
          setAccessLevel={setAccessLevel}
          clientOverride={clientOverride}
        />
      ) : (
        <div className="menuHolder"></div>
      )}
    </>
  );
}
