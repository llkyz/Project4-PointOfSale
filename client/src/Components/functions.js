import Cookies from "js-cookie";

export function doLogout(setAccessLevel, navigate) {
  Cookies.remove("token");
  setAccessLevel("notLoggedIn");
  navigate("/");
}
