import React from "react";

interface CardHeaderProps {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children }) => {
  return (
    <div className="border-b pb-4 mb-4">
      {children}
    </div>
  );
};
