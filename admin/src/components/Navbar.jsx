import {assets} from "../assets/admin_assets/assets.js";

const Navbar = () => {
    return (
        <div>
            <img className='w-[max(10%, 80px)]' src={assets.logo} alt="logo" />
            <button>Logout</button>
        </div>
    )
}

export default Navbar;