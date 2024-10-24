import React from "react";

interface CardContentProps {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ children }) => {
  return (
    <div className="space-y-4">
      {children}
    </div>
  );
};
