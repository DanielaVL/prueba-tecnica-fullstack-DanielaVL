import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "outline" | "menu" | "card";
  size?: "default" | "sm" | "lg" | "icon" | "card";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantStyles = {
      default: "bg-gray-300 hover:bg-gray-200 text-black",
      primary: "bg-blue-500 hover:bg-blue-600 text-white",
      secondary: "bg-green-500 hover:bg-green-600 text-white",
      outline: "bg-white hover:bg-gray-100 text-black border border-gray-300",
      menu: "w-48 px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded text-center",
      card: "w-64 h-64 bg-white text-black shadow-lg rounded-lg flex items-center justify-center text-center font-bold text-xl hover:bg-gray-200 transition",
    };

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 py-1 text-sm",
      lg: "h-12 px-6 py-3 text-lg",
      icon: "h-10 w-10",
      card: "",
    };

    return (
      <button
        className={cn(
          "rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
