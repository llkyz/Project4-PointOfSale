import Cookies from "js-cookie";

export default function Login({ setAccessLevel }) {
  async function doLogin(event) {
    event.preventDefault();
    let formBody = {
      username: event.target.form[0].value,
      password: event.target.form[1].value,
    };
    const res = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
    });
    let result = await res.json();
    if (res.ok) {
      Cookies.set("token", result.token);
      setAccessLevel(result.accessLevel);
    }
    console.log(result);
  }

  return (
    <>
      <h1>Login</h1>
      <form>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <input
          type="submit"
          value="Log In"
          onClick={(event) => doLogin(event)}
        />
      </form>
    </>
  );
}
