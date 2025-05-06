// layout.tsx
"use client";
import { useState } from "react";
import HeaderComponent from "./Header-main";
import SideNav from "./sidenav";

export default function Layout({
  children,
  showSidebar = true,
}: {
  children: React.ReactNode;
  showSidebar?: boolean;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <HeaderComponent />

      <div className="flex flex-1 overflow-hidden">
        {showSidebar && <SideNav />}
        <main className={`flex-1 ${showSidebar ? "ml-5" : ""} p-5 overflow-y-auto`}>
          {children}
        </main>
      </div>
    </div>
  );
}
