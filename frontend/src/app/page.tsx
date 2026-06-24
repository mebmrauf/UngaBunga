"use client";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import RecentStock from "../components/RecentStock";
import OurPolicy from "../components/OurPolicy";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-16">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12 sm:space-y-16">
        <Categories />
        <BestSeller />
        <RecentStock />
        <OurPolicy />
      </div>
    </div>
  );
}
