import { useState, useRef } from "react";
import NavbarMenu from "./NavbarMenu";

export default function Navbar({ accessLevel, setAccessLevel }) {
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
          accessLevel={accessLevel}
          setAccessLevel={setAccessLevel}
        />
      ) : (
        ""
      )}
    </>
  );
}
