import Title from "../components/Title.jsx";
import {assets} from "../assets/frontend_assets/assets.js";

const About = () => {
    return (
        <div>
            <div className="text-2xl text-center pt-8 border-t">
                <Title text1={'About'} text2={'Us'} />
            </div>

            <div className='my-10 flex flex-col md:flex-row gap-16'>
                <img className='w-full md:max-w-[450px]' src={assets.about_img} alt='' />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
                    <p>rjhgbhberbghrbhbrgkbkrhbkjbbkwbkjetbwjnerrjkn</p>
                    <p>nrjkgjkrkrebjkrbkgbkgberbgbrbibje</p>
                    <b>Our Mission</b>
                </div>

            </div>
        </div>
    )
}

export default About