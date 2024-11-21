import React from 'react';
import { Code, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm transition-colors sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Box className="text-indigo-600 dark:text-indigo-400" size={24} />
            <span className="font-bold text-xl text-gray-800 dark:text-white">DappAstra Web3 Tools Suite</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
            <a
              href="https://github.com/dappastra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
            >
              <Code size={20} />
              <span>View Source Code</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}