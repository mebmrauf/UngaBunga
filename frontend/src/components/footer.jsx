import {assets} from "../assets/assets.js";

const Footer = () => {
    return (
        <div>
            <div className="flex justify-between items-start my-10 mt-40 text-sm">
                {/* Left Side */}
                <div className="flex-1">
                    <img src={assets.logo} className="mb-5 w-32" alt="Logo" />
                    <p className="w-full md:w-2/3 text-gray-600">
                        Your one-stop shop for fresh groceries and everyday essentials!
                    </p>
                </div>

                {/* Right Side */}
                <div className="flex-1 text-right">
                    <p className="text-xl font-medium mb-5">Get In Touch</p>
                    <ul className="flex flex-col gap-1 text-gray-600">
                        <li>+8801305-091891</li>
                        <li>raufbiswas@bmrauf.me</li>
                    </ul>
                </div>
            </div>
            <div>
                <hr/>
                <p className='py-5 text-sm text-center'>Copyright 2025@ ungabunga.bmrauf.me - All Right Reserved.</p>
            </div>
        </div>
    )
}

export default Footer;