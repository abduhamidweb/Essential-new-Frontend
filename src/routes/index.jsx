import Login from "../pages/Auth/Login";
import SignIn from "../pages/Auth/SiginIn";
import Admin from "../pages/admin/Admin";
import Playgame from "../pages/Play/Playgame";
import { Route, Routes } from "react-router-dom";
import { Counter } from "../features/counter/Counter";
import Controller from "../pages/Controller/Controller";
import Writing from "../pages/Writing/Writing";
const index = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Controller />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth" element={<SignIn />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/writing" element={<Writing />} />
                <Route path="/counter" element={<Counter />} />
                <Route path="/controller" element={<Controller />} />
                <Route path="/playgame" element={<Playgame />} />
            </Routes>
        </>
    );
};

export default index;