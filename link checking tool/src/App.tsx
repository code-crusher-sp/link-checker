import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VerificationForm from './components/VerificationForm';
import VerificationResult from './components/VerificationResult';
import VerificationHistory from './components/VerificationHistory';
import { VerificationResult as VerificationResultType, VerificationHistory as VerificationHistoryType } from './types';
import { verifyLink } from './utils/verificationUtils';

function App() {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<VerificationResultType | null>(null);
  const [history, setHistory] = useState<VerificationHistoryType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('verificationHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        const historyWithDates = parsedHistory.map((item: any) => ({
          ...item,
          checkedAt: new Date(item.checkedAt)
        }));
        setHistory(historyWithDates);
      } catch (error) {
        console.error('Failed to parse history:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('verificationHistory', JSON.stringify(history));
    }
  }, [history]);

  const handleVerify = async (inputUrl: string) => {
    setUrl(inputUrl);
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const verificationResult = await verifyLink(inputUrl);
      setResult(verificationResult);
      
      const historyItem: VerificationHistoryType = {
        id: Date.now().toString(),
        url: verificationResult.url,
        status: verificationResult.status,
        securityScore: verificationResult.securityScore,
        checkedAt: verificationResult.checkedAt
      };
      
      setHistory(prev => [historyItem, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Verification failed:', error);
      setError('Failed to verify the URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (id: string) => {
    const item = history.find(h => h.id === id);
    if (item) {
      handleVerify(item.url);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <motion.div 
        className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="text-center mb-12"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="flex items-center justify-center mb-6"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Shield className="h-12 w-12 text-blue-500" />
          </motion.div>
          <motion.h1 
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            LinkGuard
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Check any link for security risks before you click. Fast, simple, and secure.
          </motion.p>
        </motion.div>

        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <VerificationForm onVerify={handleVerify} isLoading={isLoading} />
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          {isLoading && (
            <motion.div 
              className="flex justify-center my-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <motion.p 
                  className="mt-4 text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Checking link safety...
                </motion.p>
              </div>
            </motion.div>
          )}

          {!isLoading && result && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <VerificationResult result={result} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <VerificationHistory 
            history={history} 
            onSelectHistoryItem={handleSelectHistoryItem} 
          />
        </motion.div>
      </motion.div>

      <motion.footer 
        className="mt-16 border-t border-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="max-w-3xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          LinkGuard helps you browse safely by checking links before you visit them.
        </div>
      </motion.footer>
    </div>
  );
}

export default App;