import { cn } from "@/lib/utils";
import React from "react";

interface BlurTextProps {
  text: string;
  className?: string;
  variant?: "h1" | "p";
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  className,
  variant = "h1",
}) => {
  const Tag = variant;

  return (
    <Tag className={cn("animate-blur-in", className)}>
      {text}
    </Tag>
  );
};