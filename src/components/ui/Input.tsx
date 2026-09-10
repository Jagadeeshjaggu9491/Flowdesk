import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-xs font-semibold text-gray-700 tracking-wide uppercase">{label}</label>}
        <div className="relative flex items-center">
          {icon && <div className="absolute left-3.5 text-gray-400 pointer-events-none">{icon}</div>}
          <input
            ref={ref}
            className={`w-full bg-gray-100/80 border border-transparent rounded-[12px] py-2.5 ${
              icon ? "pl-10" : "pl-3.5"
            } pr-3.5 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 outline-none transition-all duration-200 ${
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""
            } ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
