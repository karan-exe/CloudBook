import "./App.css";
import React from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Home from "./component/Home";
import About from "./component/About";
import NoteState from "./context/NoteState"
import Alert from "./component/Alert";
import Login from "./component/Login";
import SingUp from "./component/SingUp";
function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null)
    }, 1500);
  }
  return (
    <div className="App">
      <NoteState>
        <BrowserRouter>
          <Navbar />
          <Alert alert={alert} />
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Home showAlert={showAlert} />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login showAlert={showAlert} />} />
              <Route path="/singup" element={<SingUp showAlert={showAlert} />} />

            </Routes>
          </div>
        </BrowserRouter>
      </NoteState>
    </div>
  );
}

export default App;
