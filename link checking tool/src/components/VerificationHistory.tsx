import React from 'react';
import { VerificationHistory as VerificationHistoryType } from '../types';
import { Clock, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { formatRelativeTime } from '../utils/verificationUtils';
import { motion, AnimatePresence } from 'framer-motion';

interface VerificationHistoryProps {
  history: VerificationHistoryType[];
  onSelectHistoryItem: (id: string) => void;
}

const VerificationHistory: React.FC<VerificationHistoryProps> = ({
  history,
  onSelectHistoryItem,
}) => {
  if (history.length === 0) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'danger':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Clock size={16} className="text-gray-500 mr-2" />
        <h2 className="text-lg font-medium text-gray-900">Recent Verifications</h2>
      </motion.div>
      <motion.div 
        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence>
          <ul className="divide-y divide-gray-100">
            {history.map((item, index) => (
              <motion.li 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <motion.button
                  onClick={() => onSelectHistoryItem(item.id)}
                  className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between text-left"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {getStatusIcon(item.status)}
                    </motion.div>
                    <span className="font-medium text-sm truncate max-w-[200px] md:max-w-[400px] text-gray-700">
                      {item.url}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">{formatRelativeTime(item.checkedAt)}</span>
                  </div>
                </motion.button>
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default VerificationHistory;