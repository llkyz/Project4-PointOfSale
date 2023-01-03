export default function Register() {
  async function doRegister(event) {
    event.preventDefault();
    let formBody = {
      username: event.target.form[0].value,
      password: event.target.form[1].value,
    };
    const res = await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
    });
    let result = await res.json();
    console.log(result);
  }

  return (
    <>
      <h1>Register Page</h1>
      <form>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <input
          type="submit"
          value="Log In"
          onClick={(event) => doRegister(event)}
        />
      </form>
    </>
  );
}
