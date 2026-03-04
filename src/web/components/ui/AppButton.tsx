import { type ReactNode } from "react";

interface AppButtonProps {
  children: ReactNode;
  onClick?: (x?: any) => void;
  variant?: "primary" | "outline" | "ghost" | "square" | "action" | "whatsapp" | "uber" | "close" | "seemore";
  size?: "xxs" | "xs" | "sm" | "md";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function AppButton({
  children,
  onClick,
  variant = "outline",
  size = "sm",
  disabled,
  className = "",
  type = "button",
}: AppButtonProps) {
  const base = "inline-flex items-center justify-center rounded-sm font-semibold tracking-[0.03em] transition-colors disabled:opacity-50";
  const sizeMap = {
    xxs: "text-[0.6rem] px-2 py-1",
    xs: "text-[0.6rem] px-2 py-1",
    sm: "text-[0.7rem] px-3 py-1",
    md: "text-[0.75rem] px-4 py-2",
  };
  const variantMap = {
    primary: "bg-bs-red text-white hover:bg-red-700",
    outline: "border border-white/25 text-white hover:border-bs-red",
    ghost: "text-gray-300 hover:text-white",
    square: "border border-white/25 text-white hover:border-bs-red btn-square",
    seemore: "border text-white hover:border-bs-red btn-square",
    action: "border border-white/25 text-white hover:border-bs-red btn-square bg-bs-red hover:bg-red-700",
    whatsapp: "border border-white/25 text-white hover:border-bs-red btn-square bg-green-500 hover:bg-green-600",
    uber: "border border-white/25 text-white hover:border-bs-red btn-square bg-green-500 hover:bg-green-600",
    close: "",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[base, sizeMap[size], variantMap[variant], className].join(" ")}
    >
      {children}
    </button>
  );
}
