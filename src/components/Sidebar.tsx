import React from 'react';
import { NavLink } from 'react-router-dom';
import { Coins, ArrowLeftRight, ChevronLeft, ChevronRight, Boxes, Lock } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <aside 
      className={`${
        isOpen ? 'w-64' : 'w-16'
      } bg-white dark:bg-gray-900 fixed left-0 top-0 bottom-0 transition-[width] duration-300 border-r border-gray-200 dark:border-gray-800 z-20 hidden md:block`}
    >
      <div className="flex h-16 border-b border-gray-200 dark:border-gray-800">
        {/* Tools text - hidden when collapsed */}
        <div className={`${isOpen ? 'w-48 px-4' : 'w-0'} overflow-hidden transition-all duration-300 flex items-center`}>
          <h2 className="font-semibold text-gray-800 dark:text-white whitespace-nowrap">Tools</h2>
        </div>
        {/* Toggle button - always 16px wide */}
        <div className="w-16 flex-shrink-0">
          <button
            onClick={onToggle}
            className="h-16 w-16 flex items-center justify-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>

      <nav className="mt-4">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center h-12 ${isOpen ? 'px-4' : 'justify-center'} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 ${
              isActive ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : ''
            }`
          }
        >
          <div className="w-8 flex justify-center">
            <Boxes size={20} />
          </div>
          <span className={`${isOpen ? 'opacity-100 ml-3 w-auto' : 'opacity-0 w-0'} whitespace-nowrap overflow-hidden transition-all duration-300`}>
            Home
          </span>
        </NavLink>

        <NavLink
          to="/token-generator"
          className={({ isActive }) =>
            `flex items-center h-12 ${isOpen ? 'px-4' : 'justify-center'} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 ${
              isActive ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : ''
            }`
          }
        >
          <div className="w-8 flex justify-center">
            <Coins size={20} />
          </div>
          <span className={`${isOpen ? 'opacity-100 ml-3 w-auto' : 'opacity-0 w-0'} whitespace-nowrap overflow-hidden transition-all duration-300`}>
            Token Generator
          </span>
        </NavLink>

        <div
          className={`flex items-center h-12 ${isOpen ? 'px-4' : 'justify-center'} text-gray-400 dark:text-gray-600 cursor-not-allowed`}
        >
          <div className="w-8 flex justify-center">
            <ArrowLeftRight size={20} />
          </div>
          <span className={`${isOpen ? 'opacity-100 ml-3 w-auto' : 'opacity-0 w-0'} whitespace-nowrap overflow-hidden transition-all duration-300 flex items-center gap-2`}>
            Emergency Transfer
            <Lock size={14} />
          </span>
        </div>
      </nav>
    </aside>
  );
}