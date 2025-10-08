import React from "react";

interface ButtonProps {
  title: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  bg?: "primary" | "secondary"
}

export const Button = ({ title, onClick, bg = "secondary" }: ButtonProps) => {
  const bgClass = {
    primary: "bg-primary hover:bg-primary-dark",
    secondary: "bg-secondary hover:bg-secondary-dark",
  }[bg];

  return (
    <button
      onClick={onClick}
      className={`py-3 px-6 text-white rounded-2xl font-medium transition-colors duration-200 ${bgClass}`}
    >
      {title}
    </button>
  );
};
