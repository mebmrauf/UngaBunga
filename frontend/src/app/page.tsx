import Hero from "../components/Hero";
import Categories from "../components/Categories";
import RecentStock from "../components/RecentStock";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";

export const revalidate = 0;

export default function Home() {
  return (
    <div>
      <Hero />
      <Categories />
      <RecentStock />
      <BestSeller />
      <OurPolicy />
    </div>
  );
}
