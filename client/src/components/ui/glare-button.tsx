import { cn } from "@/lib/utils";
import React from "react";

interface GlareButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const GlareButton = React.forwardRef<HTMLButtonElement, GlareButtonProps>(
  ({ children, className, ...props }, ref) => {
    const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const { currentTarget: target } = e;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Setel variabel CSS untuk posisi mouse
      target.style.setProperty("--mx", `${x}px`);
      target.style.setProperty("--my", `${y}px`);
    };

    return (
      <button
        ref={ref}
        onMouseMove={onMouseMove}
        className={cn(
          "group relative h-12 w-48 overflow-hidden rounded-lg bg-white/10 text-white shadow-2xl transition-all duration-300 hover:shadow-none",
          // Style untuk pseudo-element ::before yang menciptakan efek kilau
          "before:absolute before:inset-0 before:h-full before:w-full before:rounded-lg",
          "before:opacity-0 before:transition-opacity before:duration-500",
          "before:bg-[radial-gradient(circle_farthest-corner_at_var(--mx)_var(--my),_rgba(255,255,255,0.4),_transparent_80%)]",
          "group-hover:before:opacity-100",
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

GlareButton.displayName = "GlareButton";