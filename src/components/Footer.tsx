import React from 'react';

export default function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto text-center space-y-2 text-gray-600 dark:text-gray-400">
        <p>
          Built with security in mind. All smart contracts are verified and 
          audited.
        </p>
        <p className="text-sm">
          Copyright © {new Date().getFullYear()} DappAstra
        </p>
      </div>
    </footer>
  );
}