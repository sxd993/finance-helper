import React from "react";

interface ButtonProps {
  title: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  bg?: string;
  text?: string;
  size?: 'sm' | 'md';
  leftIcon?: React.ReactNode;
  className?: string;
}

export const Button = ({
  title,
  onClick,
  bg = "secondary",
  text = "white",
  size = 'md',
  leftIcon,
  className = '',
}: ButtonProps) => {
  const bgClassMap = {
    primary: "bg-primary hover:bg-primary-dark",
    secondary: "bg-secondary hover:bg-secondary-dark",
    white: "bg-white hover:bg-slate-50 border border-slate-200",
  } as const;
  const bgClass = (bgClassMap as Record<string, string>)[bg] ?? bg;

  const textClassMap = {
    white: 'text-white',
    'slate-700': 'text-slate-700',
  } as const;
  const textClass = (textClassMap as Record<string, string>)[text] ?? text;

  const sizeClass = size === 'sm'
    ? 'py-1 px-1 rounded-md flex justify-between items-center'
    : 'py-3 px-6 rounded-2xl';

  return (
    <button
      onClick={onClick}
      className={`${sizeClass} ${textClass} font-medium transition-colors duration-200 ${bgClass} ${className}`}
    >
      {leftIcon && <span className="inline-flex items-center">{leftIcon}</span>}
      <span>{title}</span>
    </button>
  );
};
