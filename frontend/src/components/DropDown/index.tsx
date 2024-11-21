import Link from 'next/link';
import React, { Children, ReactNode } from 'react';

interface DropdownProps {
  id: string;
  options: {href: string, linkName: string }[]
  Texto: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ id, Texto, isOpen, onToggle, options }) => {
  return (
    <div className="relative inline-block text-left">
      <span
        onClick={() => onToggle(id)}
        className="cursor-pointer text-sm font-semibold text-gray-900 flex items-center"
      >
        {Texto}
        <svg
          className="ml-2 h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {
            options.map((op, index) => 
            (
              <Link key={index} href={op.href} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">
              {op.linkName}
            </Link>
            )
            )
          }
        </div>
      )}
    </div>
  );
};

export default Dropdown;
