import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function NavbarMenu({ setNavbarVisibility, navbarButtonRef }) {
  const wrapper = useRef();
  useOutsideClick(wrapper, setNavbarVisibility, navbarButtonRef);

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
