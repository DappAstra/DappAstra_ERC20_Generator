import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Coins, ArrowLeftRight, Boxes, Lock } from 'lucide-react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <nav className="fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-16">
          <div className="space-y-1 p-4">
            <NavLink
              to="/"
              end
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <Boxes size={20} className="mr-3" />
              Home
            </NavLink>

            <NavLink
              to="/token-generator"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <Coins size={20} className="mr-3" />
              Token Generator
            </NavLink>

            <div className="flex items-center p-3 rounded-lg text-gray-400 dark:text-gray-600 cursor-not-allowed">
              <ArrowLeftRight size={20} className="mr-3" />
              <span className="flex items-center gap-2">
                Emergency Transfer
                <Lock size={14} />
              </span>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}