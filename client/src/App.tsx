// import DrawBoard from "./components/DrawBoard";
import { useState } from "react";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

function App() {

  const [page , setPage] = useState("login");

  return page === "login" ? (
    <Login onSwitch={() => setPage("signup")} />
  ) : (
    <Signup onSwitch={() => setPage("login")} />
  );
}

export default App;