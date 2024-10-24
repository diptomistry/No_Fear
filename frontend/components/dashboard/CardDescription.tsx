import React from "react";

interface CardDescriptionProps {
  children: React.ReactNode;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children }) => {
  return (
    <p className="text-gray-500">
      {children}
    </p>
  );
};
