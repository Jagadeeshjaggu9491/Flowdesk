import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "glass";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-[10px]",
    md: "px-4 py-2 text-sm rounded-[12px]",
    lg: "px-6 py-3 text-base rounded-[14px]",
  };

  const variantClasses = {
    primary: "bg-gradient-to-r from-[#38BDF8] to-[#2563EB] text-white font-semibold shadow-md shadow-[#38BDF8]/25 hover:shadow-lg hover:shadow-[#38BDF8]/35 hover:brightness-105 active:scale-[0.99]",
    secondary: "bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200/80 active:scale-[0.99]",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.99]",
    destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700 active:scale-[0.99]",
    glass: "ios-glass text-slate-900 hover:bg-white/90 shadow-sm border border-slate-200 active:scale-[0.99]",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />
      ) : icon ? (
        <span className="mr-2 inline-flex items-center">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
