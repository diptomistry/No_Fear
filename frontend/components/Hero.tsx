import { useState } from "react";
import { FaLocationArrow } from "react-icons/fa6";

import MagicButton from "./MagicButton";
import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import { AiOutlineLogin } from "react-icons/ai";
import CustomModal from "./CustomModal";
import TripPlanner from "./TripPlanner";

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="pb-20 pt-36" id="home">
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight
          className="h-[80vh] w-[50vw] top-10 left-full"
          fill="purple"
        />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      <div
        className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2]
       absolute top-0 left-0 flex items-center justify-center"
      >
        <div
          className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100
         bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        />
      </div>

      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <p className="uppercase tracking-widest text-xs text-center text-blue-100 max-w-80">
            Unlock Stress-Free Travel with AI
          </p>

          <TextGenerateEffect
            words="Plan Your Perfect Getaway in Minutes with AI-Powered Travel!"
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
          />

          <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
            Custom Itineraries, Real-Time Weather, and Budget-Friendly Trips at Your Fingertips
          </p>

          <div className="flex gap-5">
            <div onClick={handleOpenModal}>
              <MagicButton
                title="Start the Experience"
                icon={<FaLocationArrow />}
                position="right"
              />
            </div>

            <a href="/auth">
              <MagicButton
                title="Login"
                icon={<AiOutlineLogin />}
                position="right"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Pass content (children) to CustomModal */}
      {isModalOpen && (
        <CustomModal onRequestClose={handleCloseModal} isOpen={isModalOpen}>
          {/* Example data to be displayed in the modal */}
          <div className="p-4">
            <TripPlanner />
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default Hero;
