import { useState } from "react";
import "../../styles/Auth.css";

interface Props {
  onSwitch: () => void;
}

export default function Signup({ onSwitch }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ transform: "rotate(1deg)" }}>
        <h1 className="auth-title">Sign Up ✏</h1>

        <input
          className="auth-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

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

        <button className="auth-button">Create Account</button>

        <div className="auth-link" onClick={onSwitch}>
          Already have account? Login
        </div>
      </div>
    </div>
  );
}