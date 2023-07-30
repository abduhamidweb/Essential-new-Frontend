import { Route, Routes } from "react-router-dom";
import React from 'react';
import { Counter } from "../features/counter/Counter";
import SignIn from "../pages/Auth/SiginIn";
import Controller from "../pages/Controller/Controller";
import Playgame from "../pages/Play/Playgame";
import Admin from "../pages/admin/Admin";
import Login from "../pages/Auth/Login";
const index = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Controller />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth" element={<SignIn />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/counter" element={<Counter />} />
                <Route path="/controller" element={<Controller />} />
                <Route path="/playgame" element={<Playgame />} />
            </Routes>
        </>
    );
};

export default index;