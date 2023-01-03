import { useState, useRef, useEffect } from "react";
import NavbarMenu from "./NavbarMenu";

export default function Navbar() {
  const [navbarVisibility, setNavbarVisibility] = useState(false);
  const navbarButtonRef = useRef();

  function toggleVisibility() {
    if (navbarVisibility) {
      setNavbarVisibility(false);
    } else {
      setNavbarVisibility(true);
    }
  }

  return (
    <>
      <div
        onClick={toggleVisibility}
        ref={navbarButtonRef}
        className="navbarButton"
      />
      {navbarVisibility ? (
        <NavbarMenu
          setNavbarVisibility={setNavbarVisibility}
          navbarButtonRef={navbarButtonRef}
        />
      ) : (
        ""
      )}
    </>
  );
}
