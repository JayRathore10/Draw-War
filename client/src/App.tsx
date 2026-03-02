// import DrawBoard from "./components/DrawBoard";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { Routes ,  Route } from "react-router-dom";

function App() {
  return(
    <>
      <Routes>
        <Route
          path="/login"
          element={<Login/>}
        />

        <Route 
          path="/signup"
          element={<Signup/>}
        /> 

      </Routes>
    </>
  )
}

export default App;