import React from "react";

export type AppButtonVariant =
  | "primary"
  | "outline"
  | "ghost"
  | "square"
  | "action"
  | "actionborder"
  | "whatsapp"
  | "uber"
  | "close"
  | "closeDark"
  | "seemore";

export type AppButtonSize = "xxs" | "xs" | "sm" | "md";

export interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AppButtonVariant;
  size?: AppButtonSize;
}

export function AppButton({
  children,
  variant = "outline",
  size = "sm",
  className,
  type = "button",
  ...rest
}: AppButtonProps) {
  const shadow = "shadow-[0_3px_8px_rgba(0,0,0,0.15)]";

  const base = [
    "inline-flex",
    "font-montserrat font-semibold",
    "transition-all",
    "duration-300",
    "disabled:opacity-50",
    "select-none",
    "whitespace-nowrap",
  ].join(" ");

  const sizeMap: Record<AppButtonSize, string> = {
    xxs: "text-[0.6rem] px-1",
    xs: "text-[0.7rem] px-2 py-1",
    sm: "text-[0.8rem] px-3 py-1",
    md: "text-[0.95rem] px-4 py-2.5",
  };

  const variantMap: Record<AppButtonVariant, string> = {
    primary: `rounded-full bg-bs-red text-white border border-white items-center justify-center ${shadow} hover:bg-[#D6D6D6]`,
    outline: `rounded-full bg-[#F5F5F5] border border-[#212121] text-[#212121] items-center justify-center ${shadow} hover:bg-[#FFFFFF]`,
    ghost: "bg-transparent text-[#F5F5F5] hover:text-white",
    action: `rounded-full bg-[#B3261E] text-[#F5F5F5] border border-[#F5F5F5] items-center justify-center ${shadow} hover:bg-[#B3261E]`,
    actionborder: `rounded-[8px] bg-[#FFFFFF] text-[#212121] border border-[#B3261E] items-center justify-center uppercase ${shadow} hover:bg-[#B3261E] hover:text-[#F5F5F5]`,
    whatsapp: `rounded-full bg-[#13AC57] text-[#F5F5F5] border border-[#F5F5F5] items-center justify-center ${shadow}`,
    seemore: `rounded-[8px] bg-[#212121] text-[#F5F5F5] border border-[#F5F5F5] items-center justify-center uppercase ${shadow} hover:bg-[#000000]`,
    square: `rounded-[8px] bg-[#F5F5F5] text-[#212121] border border-[#212121] items-center ${shadow} hover:bg-[#D6D6D6]`,
    uber: `rounded-full bg-[#000000] text-[#F5F5F5] border border-[#F5F5F5] ${shadow}`,
    close: "w-8 h-8 p-0 rounded-full inline-flex items-center justify-center bg-transparent border border-[#F5F5F5] text-[#F5F5F5] shadow-none normal-case hover:bg-[#D6D6D6] hover:text-[#212121]",
    closeDark: "w-8 h-8 p-0 rounded-full inline-flex items-center justify-center bg-transparent border border-[#212121] text-[#212121] shadow-none normal-case hover:bg-[#D6D6D6] hover:text-[#F5F5F5]",
  };

  const sizeClass = variant === "close" ? "" : sizeMap[size];

  return (
    <button
      type={type}
      className={[base, sizeClass, variantMap[variant], className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
