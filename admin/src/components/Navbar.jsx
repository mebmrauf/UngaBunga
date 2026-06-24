import {assets} from "../assets/assets.js";
import { Link } from "react-router-dom";

const Navbar = ({settoken}) => {
    return (
        <div className='flex items-center py-4 px-8 justify-between glass sticky top-0 z-50 mb-6'>
            <Link to="/">
                <img className='w-32 hover:opacity-80 transition-opacity' src={assets.logo} alt="logo" />
            </Link>
            <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-sm">
                        AD
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Admin User</p>
                        <p className="text-xs text-gray-500">System Administrator</p>
                    </div>
                </div>
                <button 
                    onClick={()=>settoken('')} 
                    className='bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg cursor-pointer'
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Navbar;