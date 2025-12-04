import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: string; // tailwind color classes like "text-blue-500"
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "text-blue-500",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
    xl: "h-24 w-24 border-4",
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-transparent ${sizeClasses[size]} ${color} border-solid`}
    ></div>
  );
};

export default Spinner;
