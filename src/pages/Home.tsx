import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, ArrowLeftRight, Lock } from 'lucide-react';

const tools = [
  {
    title: 'Token Generator',
    description: 'Create and deploy your own ERC-20 tokens with customizable parameters.',
    icon: Coins,
    path: '/token-generator',
    color: 'from-blue-500 to-indigo-500',
    disabled: false
  },
  {
    title: 'Emergency Transfer',
    description: 'Quickly transfer all ERC-20 tokens from one wallet to another in bulk.',
    icon: ArrowLeftRight,
    path: '/emergency-transfer',
    color: 'from-purple-500/50 to-pink-500/50',
    disabled: true
  }
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Web3 Tools Suite
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          A collection of powerful tools for managing your blockchain assets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const Component = tool.disabled ? 'div' : Link;

          return (
            <Component
              key={tool.path}
              to={tool.disabled ? undefined : tool.path}
              className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg ${
                tool.disabled ? 'cursor-not-allowed opacity-75' : 'hover:shadow-xl transition-all duration-300'
              } p-8`}
            >
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${tool.color} text-white mb-4`}>
                  <Icon size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {tool.title}
                  </h2>
                  {tool.disabled && <Lock size={16} className="text-gray-400" />}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {tool.description}
                </p>
                {tool.disabled && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                    Coming soon
                  </p>
                )}
              </div>
              {!tool.disabled && (
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </Component>
          );
        })}
      </div>
    </div>
  );
}