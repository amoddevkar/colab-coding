import React, { useState, useContext } from "react";
import axios from "axios";
import { SocketContext } from "../Context";

const Login = () => {
  const { setUser } = useContext(SocketContext);
  const [type, setType] = useState("signup");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (type === "signup") {
      try {
        await axios.post("http://localhost:5000/signup", {
          username,
          email,
          password,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const res = await axios.post("http://localhost:5000/signin", {
          username,
          email,
          password,
        });
        setUser(res.data.user);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h2>{type === "signup" ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleSignIn}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          {type === "signup" ? "Sign Up" : "Sign In"}
        </button>
        <p>
          Already registered ?{" "}
          <span
            onClick={() => {
              setType("signin");
            }}
            style={{ color: "blue" }}
          >
            Sign in
          </span>
          here !
        </p>
      </form>
    </div>
  );
};

export default Login;

// Styling
const inputStyle = {
  padding: "10px",
  margin: "5px",
  width: "200px",
};

const buttonStyle = {
  padding: "10px",
  margin: "5px",
  width: "120px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  cursor: "pointer",
};
