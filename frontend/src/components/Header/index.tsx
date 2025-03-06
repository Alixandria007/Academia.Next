'use client'

import { useState } from "react";
import Link from "next/link";
import Options from "../Options";
import HamburgerButton from "../HamburguerButton";
import Image from "next/image";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <>
      <header className="bg-white fixed top-0 left-0 right-0 z-10 shadow">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Academia</span>
              <Image
                src="/next.svg" 
                alt="Next.js Logo"
                width={100} 
                height={24}
                priority
              />
            </Link>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            <Options />
          </div>

          <div className="lg:hidden relative">
            <HamburgerButton isOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)}/>
          </div>
        </nav>
      </header>

      <div className="p-8 my-2"></div>
    </>
  );
};
