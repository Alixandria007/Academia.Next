import { LogOut, Menu, X } from 'lucide-react';
import Options from '../Options';

interface HamburgerButtonProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const HamburgerButton = ({ isOpen, toggleMenu }: HamburgerButtonProps) => {
    return (
        <>
        <button onClick={() => toggleMenu()} className="text-gray-900 focus:outline-none">
         {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {isOpen && (
        <div className="absolute right-4 p-2 top-16 w-56 bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden animate-slide-down">
            <ul className="flex flex-col gap-1 divide-y divide-gray-10">
            <Options />
            </ul>
        </div>
        )}
    </>
    );
    };

    export default HamburgerButton;
