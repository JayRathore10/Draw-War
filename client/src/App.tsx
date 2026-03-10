import DrawBoard from "./components/DrawBoard";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import { Routes ,  Route } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

function App() {

  useEffect(()=>{
    const fetchJexts = async()=>{
      try{
        const response = await axios.get("http://localhost:3000/");
        console.log(response.data);
      }catch(error){
        console.log(error);
      }
    }
    fetchJexts();
  } , []);

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
        <Route 
          path="/draw"
          element={<DrawBoard/>}
        />
        <Route 
          path="/home"
          element={<Home/>}
        />
      </Routes>
    </>
  )
}

export default App;