import React from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: React.ReactNode;
  link: string;
}

export default function Tooltip({ content, link }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-help" />
      <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 absolute z-50 transform -translate-x-1/2 translate-y-2 left-1/2 bottom-full mb-2">
        <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-72">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {content}
            <a 
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline inline-block mt-2"
            >
              Learn More →
            </a>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-2">
            <div className="border-8 border-transparent border-t-white dark:border-t-gray-800"></div>
          </div>
        </div>
      </div>
    </div>
  );
}