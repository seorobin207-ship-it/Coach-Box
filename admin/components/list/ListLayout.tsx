import React from "react";

interface ListLayoutProps {
  children: React.ReactNode;
}

export function ListLayout({children}: ListLayoutProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5">
      {children}
    </div>
  );
}
