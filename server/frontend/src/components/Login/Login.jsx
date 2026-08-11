import React, { useState } from "react";
import "./Login.css";
import user_icon from "../../assets/person.png";
import password_icon from "../../assets/password.png";
import close_icon from "../../assets/close.png";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const gohome = () => {
    window.location.href = window.location.origin;
  };

  const login = async (e) => {
    e.preventDefault();

    let login_url = window.location.origin + "/djangoapp/login";

    const res = await fetch(login_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, password }),
    });

    const json = await res.json();
    if (json.status === "Authenticated") {
      sessionStorage.setItem("username", json.userName);
      window.location.href = window.location.origin;
    } else {
      alert("The user could not be authenticated.");
    }
  };

  return (
    <div className="login_container" style={{ width: "40%" }}>
      <div className="header" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <span className="text" style={{ flexGrow: "1" }}>
          Login
        </span>
        <a href="/" onClick={() => gohome()}>
          <img style={{ width: "1cm" }} src={close_icon} alt="X" />
        </a>
        <hr />
      </div>

      <form onSubmit={login}>
        <div className="input">
          <img src={user_icon} className="img_icon" alt="Username" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="input_field"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className="input">
          <img src={password_icon} className="img_icon" alt="password" />
          <input
            name="psw"
            type="password"
            placeholder="Password"
            className="input_field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="submit_panel">
          <input className="submit" type="submit" value="Login" />
          <a href="/register" className="register_now">
            Register Now
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
