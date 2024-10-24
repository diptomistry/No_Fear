"use client";

import { navItems } from "@/data";

import Hero from "@/components/Hero";

import Footer from "@/components/Footer";

import Approach from "@/components/Approach";
import Experience from "@/components/Experience";

import { FloatingNav } from "@/components/ui/FloatingNavbar";
import Header from "@/components/Header";
const Home = () => {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-clip">
      <div className="max-w-7xl w-full">
        <Header />
        <FloatingNav navItems={navItems} />
        <Hero />
        <Experience />
        <Approach />
        <Footer />
      </div>
    </main>
  );
};

export default Home;
