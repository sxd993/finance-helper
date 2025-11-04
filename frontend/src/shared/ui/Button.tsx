import React from "react";

interface ButtonProps {
  title?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  bg?: string;
  text?: string;
  size?: 'sm' | 'md';
  leftIcon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const Button = ({
  title,
  onClick,
  bg = "secondary",
  text = "white",
  size = 'md',
  leftIcon,
  className = '',
  disabled = false,
}: ButtonProps) => {
  const bgClassMap = {
    primary: "bg-primary hover:bg-primary-dark",
    secondary: "bg-secondary hover:bg-secondary-dark",
    white: "bg-white hover:bg-slate-50 border border-slate-300",
  } as const;
  const bgClass = (bgClassMap as Record<string, string>)[bg] ?? bg;

  const textClassMap = {
    white: 'text-white',
    'slate-700': 'text-slate-700',
  } as const;
  const textClass = (textClassMap as Record<string, string>)[text] ?? text;

  const sizeClass = size === 'sm'
    ? 'py-2 px-3 rounded-xl flex justify-center items-center'
    : 'py-3 px-6 rounded-2xl';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClass} ${textClass} font-medium transition-colors duration-200 ${bgClass} ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
    >
      {leftIcon && <span className="inline-flex items-center">{leftIcon}</span>}
      <span>{title}</span>
    </button>
  );
};
