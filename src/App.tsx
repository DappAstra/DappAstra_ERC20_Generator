import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTheme } from './hooks/useTheme';
import Layout from './components/Layout';
import Home from './pages/Home';
import TokenGenerator from './pages/TokenGenerator';
import UnavailablePage from './pages/UnavailablePage';
import ToastContainer from './components/ToastContainer';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { isDark, setIsDark } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
          <Layout isDark={isDark} onToggleTheme={() => setIsDark(!isDark)}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/token-generator" element={<TokenGenerator />} />
              <Route path="/emergency-transfer" element={<UnavailablePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
          <ToastContainer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;