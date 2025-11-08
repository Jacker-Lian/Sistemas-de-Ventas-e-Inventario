import {useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const hideLayout = location.pathname === "/";

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
      <header className="bg-blue-600 text-white py-4 px-6 shadow-md flex items-center justify-between">
        <h1 className="text-xl font-bold">Sistema General</h1>
      </header>

      <main className="flex-grow p-6">{children}</main>

      <footer className="bg-blue-600 text-white text-center py-3 text-sm">
      </footer>
    </div>
  );
}

