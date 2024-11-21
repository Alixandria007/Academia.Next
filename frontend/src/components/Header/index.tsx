import Dropdown from "@/components/DropDown"
import DropdownContainer from "../DropdownContainer";
import Link from "next/link";

export const Header = () => {
  return (
    <>
    <header className="bg-white fixed top-0 left-0 right-0 z-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Academia</span>
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
              alt="Logo"
            />
          </Link>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          <DropdownContainer />
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm/6 font-semibold text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
    </header>

    <div className="p-8"></div>
    
    </>
  );
};
