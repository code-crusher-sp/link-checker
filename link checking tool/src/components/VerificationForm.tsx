import React, { useState } from 'react';
import { SearchIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface VerificationFormProps {
  onVerify: (url: string) => void;
  isLoading: boolean;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ onVerify, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onVerify(url.trim());
    }
  };

  const handleClear = () => {
    setUrl('');
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="w-full"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <motion.input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter a link to verify its safety"
          className="w-full px-4 py-4 pr-24 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-700 text-lg"
          disabled={isLoading}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        {url && (
          <motion.button
            type="button"
            onClick={handleClear}
            className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Clear input"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} />
          </motion.button>
        )}
        <motion.button
          type="submit"
          disabled={isLoading || !url.trim()}
          className={`absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg flex items-center justify-center ${
            isLoading || !url.trim()
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 transition-colors'
          }`}
          whileHover={!isLoading && url.trim() ? { scale: 1.05 } : {}}
          whileTap={!isLoading && url.trim() ? { scale: 0.95 } : {}}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <SearchIcon size={18} className="mr-1" />
              Check
            </>
          )}
        </motion.button>
      </div>
      <motion.p 
        className="mt-2 text-sm text-gray-500 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Paste any link to verify its safety before visiting
      </motion.p>
    </motion.form>
  );
};

export default VerificationForm;