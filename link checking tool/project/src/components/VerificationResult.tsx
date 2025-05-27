import React, { useState } from 'react';
import { VerificationResult as VerificationResultType } from '../types';
import { ChevronDown, ChevronUp, Shield, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { formatRelativeTime } from '../utils/verificationUtils';
import { motion, AnimatePresence } from 'framer-motion';

interface VerificationResultProps {
  result: VerificationResultType;
}

const VerificationResult: React.FC<VerificationResultProps> = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'safe':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'danger':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div 
      className={`border rounded-xl overflow-hidden shadow-sm ${getStatusColor(result.status)}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <motion.div 
            className="flex-1"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
          >
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.01 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                {getStatusIcon(result.status)}
              </motion.div>
              <h3 className="ml-2 font-medium text-lg truncate">
                {result.url}
              </h3>
            </motion.div>
            <motion.div 
              className="flex flex-wrap gap-2 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span 
                className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(result.status)}`}
                whileHover={{ scale: 1.05 }}
              >
                {result.status === 'safe' ? 'Safe' : result.status === 'warning' ? 'Warning' : 'Danger'}
              </motion.span>
              <motion.span 
                className={`text-sm font-medium px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200`}
                whileHover={{ scale: 1.05 }}
              >
                Score: <span className={getScoreColor(result.securityScore)}>{result.securityScore}</span>/100
              </motion.span>
              {result.statusCode && (
                <motion.span 
                  className={`text-sm font-medium px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200`}
                  whileHover={{ scale: 1.05 }}
                >
                  Status: {result.statusCode}
                </motion.span>
              )}
            </motion.div>
          </motion.div>
          <motion.button
            onClick={toggleExpand}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </motion.button>
        </div>
        <motion.div 
          className="text-xs text-gray-500 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Checked {formatRelativeTime(result.checkedAt)}
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="border-t bg-white/80 backdrop-blur-sm"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="font-medium text-sm mb-3">Security Details</h4>
                  <ul className="space-y-3">
                    <motion.li 
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                    >
                      {result.details.phishingDetected ? 
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2" /> : 
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      }
                      Phishing Detection: {result.details.phishingDetected ? 'Detected' : 'Not Detected'}
                    </motion.li>
                    <motion.li 
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                    >
                      {result.details.malwareRisk ? 
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2" /> : 
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      }
                      Malware Risk: {result.details.malwareRisk ? 'Detected' : 'Not Detected'}
                    </motion.li>
                    <motion.li 
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                    >
                      {result.details.suspiciousDomain ? 
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2" /> : 
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      }
                      Suspicious Domain: {result.details.suspiciousDomain ? 'Yes' : 'No'}
                    </motion.li>
                    <motion.li 
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                    >
                      {!result.sslValid ? 
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2" /> : 
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      }
                      SSL Certificate: {result.sslValid ? 'Valid' : 'Invalid/Missing'}
                    </motion.li>
                  </ul>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="font-medium text-sm mb-3">Additional Information</h4>
                  <ul className="space-y-3">
                    <motion.li 
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                    >
                      <span className="font-medium mr-2">Response Time:</span>
                      {result.responseTime ? `${result.responseTime}ms` : 'Unknown'}
                    </motion.li>
                    <motion.li 
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                    >
                      <span className="font-medium mr-2">Redirects:</span>
                      {result.redirectCount || 0}
                    </motion.li>
                    {result.details.domainAge && (
                      <motion.li 
                        className="flex items-center"
                        whileHover={{ x: 5 }}
                      >
                        <span className="font-medium mr-2">Domain Age:</span>
                        {result.details.domainAge}
                      </motion.li>
                    )}
                    {result.details.hostingProvider && (
                      <motion.li 
                        className="flex items-center"
                        whileHover={{ x: 5 }}
                      >
                        <span className="font-medium mr-2">Hosting Provider:</span>
                        {result.details.hostingProvider}
                      </motion.li>
                    )}
                  </ul>
                </motion.div>
              </div>
              
              {result.details.redirectChain && result.details.redirectChain.length > 1 && (
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h4 className="font-medium text-sm mb-3">Redirect Chain</h4>
                  <div className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto">
                    <ul className="space-y-2">
                      {result.details.redirectChain.map((url, index) => (
                        <motion.li 
                          key={index} 
                          className="flex items-center"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          {index > 0 && <span className="text-gray-400 mx-2">→</span>}
                          <span className="truncate">{url}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VerificationResult;