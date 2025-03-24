'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import ChatInterface from '@/components/ChatInterface';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchResult, ChatMessage } from '@/types';
import { generateMockResults, generateMockChatResponse } from '@/services/mockData';

const PAGE_SIZE = 6;
const MAX_PAGES = 5; // Pretend there are the most pages possible

export default function Home() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setCurrentQuery(query);
    setCurrentPage(1);
    setHasMore(true);
    setResults([]);
    
    // Add user's search query to chat
    const userMessage: ChatMessage = {
      id: `chat-${Date.now()}`,
      content: `Searching for: ${query}`,
      type: 'user',
      timestamp: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, userMessage]);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock results
    const mockResults = generateMockResults(query, 1, PAGE_SIZE);
    setResults(mockResults);

    // Add system response
    const systemMessage = generateMockChatResponse(query);
    setChatMessages(prev => [...prev, systemMessage]);

    setIsLoading(false);
  };

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const nextPage = currentPage + 1;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate more mock results
    const newResults = generateMockResults(currentQuery, nextPage, PAGE_SIZE);
    setResults(prev => [...prev, ...newResults]);
    setCurrentPage(nextPage);
    setHasMore(nextPage < MAX_PAGES);

    setIsLoading(false);
  };

  const handleChatMessage = async (message: string) => {
    setIsLoading(true);
    setCurrentPage(1);
    setHasMore(true);
    setResults([]);

    // Add user message
    const userMessage: ChatMessage = {
      id: `chat-${Date.now()}`,
      content: message,
      type: 'user',
      timestamp: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, userMessage]);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate new results based on the chat message
    const newResults = generateMockResults(`${currentQuery} ${message}`, 1, PAGE_SIZE);
    setResults(newResults);

    // Add system response
    const systemMessage = generateMockChatResponse(message);
    setChatMessages(prev => [...prev, systemMessage]);

    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Findify
          </h1>
          <ThemeToggle />
        </div>

        <div className="space-y-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Search Results
              </h2>
              <SearchResults
                results={results}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                isLoading={isLoading}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Chat Interface
              </h2>
              <ChatInterface
                messages={chatMessages}
                onSendMessage={handleChatMessage}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
