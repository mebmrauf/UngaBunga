import {NavLink} from "react-router-dom";
import {assets} from "../assets/assets.js";

const Sidebar = () => {
    return (
        <div className='w-[20%] min-h-[calc(100vh-100px)] glass ml-4 rounded-2xl overflow-hidden shadow-sm flex flex-col'>
            <div className='flex flex-col gap-2 pt-8 px-4 text-[15px]'>
                
                <NavLink 
                    className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'nav-active shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`} 
                    to='/'
                >
                    <div className="w-6 h-6 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    </div>
                    <p className='hidden md:block font-medium'>Dashboard</p>
                </NavLink>

                <NavLink 
                    className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'nav-active shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`} 
                    to='/add'
                >
                    <div className="w-6 h-6 flex items-center justify-center">
                        <img className='w-5 h-5 opacity-70' src={assets.add_icon} alt='' />
                    </div>
                    <p className='hidden md:block font-medium'>Add Product</p>
                </NavLink>

                <NavLink 
                    className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'nav-active shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`} 
                    to='/list'
                >
                    <div className="w-6 h-6 flex items-center justify-center">
                        <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                    </div>
                    <p className='hidden md:block font-medium'>Products</p>
                </NavLink>

                <NavLink 
                    className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'nav-active shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`} 
                    to='/categories'
                >
                    <div className="w-6 h-6 flex items-center justify-center">
                        <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                    </div>
                    <p className='hidden md:block font-medium'>Categories</p>
                </NavLink>

                <NavLink 
                    className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'nav-active shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`} 
                    to='/orders'
                >
                    <div className="w-6 h-6 flex items-center justify-center">
                        <img className='w-5 h-5 opacity-70' src={assets.order_icon} alt='' />
                    </div>
                    <p className='hidden md:block font-medium'>Orders</p>
                </NavLink>

            </div>
        </div>
    )
}

export default Sidebar;