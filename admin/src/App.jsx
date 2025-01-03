import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./components/Login.jsx";
import {Route, Routes} from "react-router-dom";
import Add from "./pages/Add.jsx";
import List from "./pages/List.jsx";
import Orders from "./pages/Orders.jsx";
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
        <div className='bg-white min-h-screen'>
            <ToastContainer />
            {
                token === ''
                ? <Login settoken={settoken} />
                :
                    <>
                        <Navbar settoken={settoken} />
                        <hr/>
                        <div className='flex w-full'>
                            <Sidebar />
                            <div className='w-[70%] mx-auto ml-6 sm:ml-8 md:ml-[25px] lg:ml-[5vw] my-8 text-gray-600 text-base'>
                                <Routes>
                                    <Route path='/add' element={<Add token={token} />}/>
                                    <Route path='/list' element={<List token={token} />}/>
                                    <Route path='/orders' element={<Orders token={token} />}/>
                                </Routes>
                            </div>
                        </div>
                    </>
            }
        </div>
    )
}

export default App;