import { ReactNode } from "react";

interface MobileViewportProps {
  children: ReactNode;
}

export function MobileViewport({ children }: MobileViewportProps) {
  return (
    <div className="relative min-h-screen w-full bg-secondary flex items-center justify-center">
      {/* Mobile Frame */}
      <div className="relative w-full max-w-md mx-auto bg-background shadow-2xl overflow-hidden" style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
}
