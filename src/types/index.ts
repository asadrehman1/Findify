export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'system';
  timestamp: string;
}

export interface SearchState {
  results: SearchResult[];
  chatMessages: ChatMessage[];
  isLoading: boolean;
  currentQuery: string;
} 