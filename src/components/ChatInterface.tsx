import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

// Chat bubble variants for animation
const bubbleVariants = {
  initial: (type: string) => ({
    opacity: 0,
    x: type === 'user' ? 20 : -20,
    y: 10,
    scale: 0.9,
  }),
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export default function ChatInterface({
  messages,
  onSendMessage,
  isLoading = false,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  // Determine if there are no messages
  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[500px] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Chat header with decoration */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex space-x-1">
            <span className="h-3 w-3 bg-red-500 rounded-full"></span>
            <span className="h-3 w-3 bg-yellow-500 rounded-full"></span>
            <span className="h-3 w-3 bg-green-500 rounded-full"></span>
          </div>
          <span className="ml-3 font-medium text-gray-700 dark:text-gray-200">Interactive Chat</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="inline-block h-2 w-2 bg-green-500 rounded-full"></span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {isEmpty ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5 } }}
            className="h-full flex flex-col items-center justify-center text-center px-4"
          >
            <div className="w-16 h-16 mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Start a conversation</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
              Search for something or ask a question to start an interactive chat session
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                custom={message.type}
                variants={bubbleVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'system' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="mt-1 flex justify-between items-center">
                    <span className={`text-xs ${message.type === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.type === 'user' && (
                      <span className="text-xs text-blue-100">
                        <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ml-2">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <motion.div 
        initial={{ y: 10, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700"
      >
        <form onSubmit={handleSubmit}>
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type your message..."
              className={`flex-1 py-3 px-4 pr-16 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                isFocused ? 'focus:ring-blue-500 dark:focus:ring-blue-400' : 'focus:ring-transparent'
              }`}
              disabled={isLoading}
            />
            <AnimatePresence mode="wait">
              <motion.button
                key={isLoading ? 'loading' : 'send'}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-1 p-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </motion.div>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </motion.button>
            </AnimatePresence>
          </div>
          
          {/* Typing indicator or helper text */}
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            {isLoading ? 
              "AI assistant is typing..." : 
              "Send a message to continue the conversation"}
          </div>
        </form>
      </motion.div>
    </div>
  );
} 