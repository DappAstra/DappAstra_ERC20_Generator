import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import MobileNav from './MobileNav';

interface LayoutProps {
  children: React.ReactNode;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Layout({ children, isDark, onToggleTheme }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <MobileNav />
      
      <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'md:ml-64' : 'md:ml-16'} transition-[margin] duration-300`}>
        <Navbar 
          isDark={isDark} 
          onToggleTheme={onToggleTheme}
        />
        
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}