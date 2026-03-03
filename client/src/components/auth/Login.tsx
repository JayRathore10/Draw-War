import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ transform: "rotate(1deg)" }}>
        <h1 className="auth-title">
          Login <span className="pencil">✏</span>
        </h1>

        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-button-login">Login</button>

        <div className="auth-link"
          onClick={() => navigate("/signup")}
        >
          Don't have account? Sign Up
        </div>
      </div>
    </div>
  );
}

/**
 * after login 
 * go to the play game page button 
 * local connectivity also happen
 * where we automatically connect to the player 
 * and then play game 
 */