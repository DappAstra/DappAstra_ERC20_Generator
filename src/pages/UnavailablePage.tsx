import React from 'react';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UnavailablePage() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
            <Lock size={48} className="text-gray-600 dark:text-gray-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Page Currently Unavailable
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          This feature is currently under development and will be available soon.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}