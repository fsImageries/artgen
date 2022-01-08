import React from 'react'
import { Route, Routes, Link } from "react-router-dom";

import Home from "./routes/Home.route"
import SimpleFlowFieldRoute from "./routes/SimpleFlowField.route"

import "./styles/base.scss"

const App = () => {
    return (
        <>
        {/* <Link to="/flowField">Flow Field</Link> */}
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/flowField" element={<SimpleFlowFieldRoute/>}/>
        </Routes>
        </>
    )
}

// const Home = ()=>{
//     return (
//         <Link to="/flowField">Flow Field</Link>
//     )
// }

export default App
