import React from "react";

interface CardTitleProps {
  children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children }) => {
  return (
    <h2 className="text-xl font-semibold text-gray-900">
      {children}
    </h2>
  );
};
