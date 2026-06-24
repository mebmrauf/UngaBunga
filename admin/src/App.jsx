import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./components/Login.jsx";
import {Route, Routes} from "react-router-dom";
import Add from "./pages/Add.jsx";
import List from "./pages/List.jsx";
import Orders from "./pages/Orders.jsx";
import Categories from "./pages/Categories.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import {useEffect, useState} from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '৳'

const App = () => {
    const [token, settoken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : "");

    useEffect(() => {
        localStorage.setItem('token', token);
    },[token]);

    return (
        <div className='bg-slate-50 min-h-screen text-slate-700 font-sans'>
            <ToastContainer />
            {
                token === ''
                ? <Login settoken={settoken} />
                :
                    <>
                        <Navbar settoken={settoken} />
                        <div className='flex w-full px-4 sm:px-8'>
                            <Sidebar />
                            <div className='w-full ml-4 md:ml-8 lg:ml-10 max-w-7xl pb-10'>
                                <Routes>
                                    <Route path='/' element={<Dashboard token={token} />}/>
                                    <Route path='/add' element={<Add token={token} />}/>
                                    <Route path='/list' element={<List token={token} />}/>
                                    <Route path='/orders' element={<Orders token={token} />}/>
                                    <Route path='/categories' element={<Categories token={token} />}/>
                                </Routes>
                            </div>
                        </div>
                    </>
            }
        </div>
    )
}

export default App;