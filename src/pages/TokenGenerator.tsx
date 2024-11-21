import React from 'react';
import TokenForm from '../components/TokenForm';

export default function TokenGenerator() {
  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Create Your Own Token
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Deploy your ERC-20 token on multiple networks with our secure, 
          user-friendly token generator.
        </p>
      </div>

      <TokenForm />
    </>
  );
}