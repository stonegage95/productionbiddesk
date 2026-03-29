import { ReactNode } from "react";

const GradientText = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <span
    className={`bg-clip-text text-transparent ${className}`}
    style={{
      backgroundImage: "linear-gradient(135deg, hsl(43 72% 52%), hsl(43 68% 70%), hsl(43 72% 52%))",
    }}
  >
    {children}
  </span>
);

export default GradientText;
