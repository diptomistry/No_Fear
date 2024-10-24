// BudgetCalculatorCard.tsx
import Link from "next/link";
import { useState } from "react";
import { Calculator } from "lucide-react";
import CustomModal from "../CustomModal";
import TravelBudgetCalculator from "./calculator";

const BudgetCalculatorCard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col bg-black rounded-3xl max-w-sm">
      <div className="px-6 py-8 sm:p-10 sm:pb-6">
        <div className="grid items-center justify-center w-full grid-cols-1 text-left">
          <div className="flex items-center space-x-2">
            <Calculator className="w-6 h-6 text-white" />
            <h2 className="text-lg font-medium tracking-tighter text-white lg:text-3xl">
              Travel Budget
            </h2>
          </div>
          <p className="mt-2 text-sm text-gray-100">
            Plan your trip expenses easily and efficiently
          </p>
          <div className="mt-6">
            <p>
              <span className="text-5xl font-light tracking-tight text-white">
                Free
              </span>
              <span className="text-base font-medium text-white">
                {" "}
                calculator{" "}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex px-6 pb-8 sm:px-8">
        <button className="items-center justify-center w-full px-6 py-2.5 text-center text-black duration-200 bg-white border-2 border-white rounded-full inline-flex hover:bg-transparent hover:border-white hover:text-white focus:outline-none focus-visible:outline-white text-sm focus-visible:ring-white"
        onClick={() => setModalOpen(true)}
        >
          Start Planning
        </button>
      </div>
      <CustomModal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
        <TravelBudgetCalculator />
      </CustomModal>
    </div>
  );
};

export default BudgetCalculatorCard;
