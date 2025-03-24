import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      console.log("Form submitted with query:", query.trim());
      onSearch(query.trim());
    }
  };

  // Also trigger search on Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      console.log("Enter key pressed with query:", query.trim());
      onSearch(query.trim());
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        <form 
          onSubmit={handleSubmit} 
          className="relative backdrop-blur-md bg-white/90 dark:bg-gray-800/90 p-1 rounded-xl shadow-lg"
        >
          <div className="relative flex items-center">
            <MagnifyingGlassIcon className={`absolute left-4 h-6 w-6 transition-colors duration-300 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Search for anything..."
              className="w-full px-6 py-4 pl-12 text-lg bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              disabled={isLoading}
            />
            
            <AnimatePresence mode="wait">
              <motion.button
                key={isLoading ? 'loading' : 'search'}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                type="submit"
                disabled={isLoading || !query.trim()}
                className="absolute right-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                ) : (
                  'Search'
                )}
              </motion.button>
            </AnimatePresence>
          </div>
        </form>
      </div>
      
      {query && !isLoading && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400"
        >
          Press Enter to search for <span className="font-semibold text-blue-600 dark:text-blue-400">{query}</span>
        </motion.div>
      )}
    </motion.div>
  );
} 