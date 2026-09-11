import type { ButtonHTMLAttributes, ReactNode } from "react";

export type AdminButtonVariant =
  | "primary"
  | "neutral"
  | "danger"
  | "secondary";

const variantClass: Record<AdminButtonVariant, string> = {
  primary:
    "bg-mai-green text-white hover:bg-[#5A8F2E] border border-transparent",
  neutral:
    "bg-mai-blue text-white hover:bg-[#0D7EB0] border border-transparent",
  danger: "bg-mai-red text-white hover:bg-[#D9531A] border border-transparent",
  secondary:
    "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
};

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: AdminButtonVariant;
  children: ReactNode;
};

export function AdminButton({
  variant = "primary",
  className = "",
  children,
  type = "button",
  ...props
}: AdminButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${variantClass[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function adminActionClass(variant: AdminButtonVariant) {
  return `inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${variantClass[variant]}`;
}
