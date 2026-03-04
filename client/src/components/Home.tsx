import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="game-title">
          <span>Draw</span>
          <img src="/drawwar.png" alt="Draw War Logo" className="logo" />
          <span>War</span>
        </h1>
        <button className="play-button" onClick={() => navigate("/play")}>
          Play
        </button>
      </div>
    </div>
  );
}