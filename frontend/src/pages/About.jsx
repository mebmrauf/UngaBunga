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
                    <p>We’re dedicated to providing the freshest groceries, quality products, and friendly service. We aim to make your shopping experience easy and convenient, offering a wide range of items to meet all your daily needs. Whether you're stocking up on essentials or trying something new, we’ve got you covered!</p>
                    <b>Our Mission</b>
                    <p>Our mission is delivering fresh, high-quality groceries with exceptional service, making everyday shopping convenient, affordable, and enjoyable for our community.</p>
                </div>

            </div>
        </div>
    )
}

export default About