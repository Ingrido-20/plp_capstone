import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  size?: "sm" | "md";
}

export function Button({ variant = "primary", size = "md", className, ...rest }: ButtonProps) {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center rounded-pill font-semibold transition-all duration-150 ease-out active:scale-[0.97]",
        size === "md" ? "px-4 py-2 text-[13px]" : "px-3 py-1.5 text-[12px]",
        variant === "primary"
          ? "bg-teal text-white shadow-soft hover:brightness-105"
          : "bg-surface border border-border text-text hover:bg-black/[0.03]",
        className
      )}
      {...rest}
    />
  );
}
