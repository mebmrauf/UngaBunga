import {assets} from "../assets/frontend_assets/assets.js";

const Footer = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    <img src={assets.logo} className='mb-5 w-32' alt=""/>
                    <p className='w-full md:w-2/3 text-gray-600'>
                        UngaBunga
                    </p>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>Company</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>Get In Touch</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
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