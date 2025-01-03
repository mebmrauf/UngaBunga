import Hero from "../components/Hero.jsx";
import RecentStock from "../components/RecentStock.jsx";
import BestSeller from "../components/BestSeller.jsx";
import OurPolicy from "../components/OurPolicy.jsx";
import Categories from "../components/Categories.jsx";

const Home = () => {
    return (
        <div>
            <Hero/>
            <RecentStock/>
            <BestSeller/>
            <Categories/>
            <OurPolicy/>
        </div>
    )
}

export default Home