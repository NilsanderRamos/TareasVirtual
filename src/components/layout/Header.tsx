"use client";


  import { useState } from "react";
  import Link from "next/link";
  import { siteConfig } from "@/config/site";
  import { mainNav } from "@/config/navigation";


  export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    return (
      <header className="sticky top-0 z-50 w-full border-b
        border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center
          justify-between px-4">
          <Link href="/" className="text-xl font-bold
            text-gray-900 hover:text-blue-600 transition-colors">
            {siteConfig.name}
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href}
                className="text-sm font-medium text-gray-600
                hover:text-gray-900 transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2" aria-label="Menu">
            <span className="block w-5 h-0.5 bg-gray-600 mb-1" />
            <span className="block w-5 h-0.5 bg-gray-600 mb-1" />
            <span className="block w-5 h-0.5 bg-gray-600" />
          </button>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 p-4">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href}
                className="block py-2 text-gray-600
                hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    );
  }

