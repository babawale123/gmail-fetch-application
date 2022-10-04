import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "../index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../views/Home";

const App = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Home /> } />
                <Route path="*" element={ <Navigate to="/" /> } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
