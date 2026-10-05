"use client";

import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="app-page-enter flex flex-1 flex-col">
      {children}
    </div>
  );
}
