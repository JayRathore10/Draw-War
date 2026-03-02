import { useState } from "react";
import "../../styles/Auth.css";

interface Props {
  onSwitch: () => void;
}

export default function Login({ onSwitch }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Login ✏</h1>

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

        <button className="auth-button">Login</button>

        <div className="auth-link" onClick={onSwitch}>
          Don't have account? Sign Up
        </div>
      </div>
    </div>
  );
}