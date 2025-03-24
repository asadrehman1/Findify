import { SearchResult, ChatMessage } from '@/types';

const categories = ['Technology', 'Science', 'Arts', 'Business', 'Health'];
const topics = [
  'Artificial Intelligence',
  'Climate Change',
  'Space Exploration',
  'Digital Marketing',
  'Healthcare Innovation',
  'Renewable Energy',
  'Cybersecurity',
  'E-commerce Trends',
  'Mental Health',
  'Sustainable Living'
];

const generateDescription = (query: string, topic: string) => {
  return `Discover the latest insights about ${topic} in relation to "${query}". This comprehensive analysis provides valuable information and practical applications in today's rapidly evolving landscape. Learn about key trends, challenges, and opportunities in this dynamic field.`;
};

export const generateMockResults = (query: string, page: number = 1, pageSize: number = 6): SearchResult[] => {
  const startIndex = (page - 1) * pageSize;
  
  return Array.from({ length: pageSize }, (_, index) => {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    return {
      id: `result-${startIndex + index + 1}`,
      title: `${topic}: ${query}`,
      description: generateDescription(query, topic),
      category: categories[Math.floor(Math.random() * categories.length)],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last week
    };
  });
};

export const generateMockChatResponse = (message: string): ChatMessage => {
  const responses = [
    `I've refined the search based on your question about "${message}". Here are the updated results that should better match your interests.`,
    `Based on your follow-up question, I've adjusted the search parameters to focus more specifically on "${message}".`,
    `I understand you're looking for more detailed information about "${message}". I've updated the results to include more relevant content.`,
    `Let me help you explore that aspect of "${message}" with these refined search results.`,
    `I've modified the search to better address your question about "${message}". Here are the most relevant results.`
  ];

  return {
    id: `chat-${Date.now()}`,
    content: responses[Math.floor(Math.random() * responses.length)],
    type: 'system',
    timestamp: new Date().toISOString(),
  };
}; 