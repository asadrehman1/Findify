import { useEffect } from "react";
import { SearchResult } from "@/types";
import { useInView } from "react-intersection-observer";

interface SearchResultsProps {
  results: SearchResult[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function SearchResults({
  results,
  onLoadMore,
  hasMore,
  isLoading,
}: SearchResultsProps) {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoading, onLoadMore]);

  // For troubleshooting - log the results
  console.log("Search Results:", results);

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400 bg-white/90 dark:bg-gray-800/90 rounded-lg h-full w-full">
        <svg className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {isLoading ? (
          <p className="text-lg font-medium">Searching...</p>
        ) : (
          <>
            <p className="text-lg font-medium">No results found</p>
            <p className="mt-2">Try a different search query</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 content-container"> 
      {/* Debug info - will be removed in production */}
      {results.length > 0 && (
        <div className="mb-4 p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md">
          Showing {results.length} results
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 w-full">
        {results.map((result, index) => (
          <div
            key={result.id}
            className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-blue-100 dark:border-blue-900 w-full"
          >
            {/* Highlight effect for better visibility */}
            <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Category badge with animated gradient border */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rotate-45 z-0"></div>
            
            <div className="relative z-10 p-6 w-full">
              <div className="flex items-center justify-between mb-4 w-full">
                <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full shadow-sm">
                  {result.category}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(result.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {result.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 text-sm">
                {result.description}
              </p>
              
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div className="flex space-x-3">
                  {['#tech', '#research', index % 2 === 0 ? '#popular' : '#trending'].map((tag, i) => (
                    <span key={i} className="text-xs text-gray-500 dark:text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group-hover:underline">
                  Read more
                  <svg className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div ref={ref} className="flex justify-center py-6 bg-white/90 dark:bg-gray-800/90 rounded-lg mt-4">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
          ) : (
            <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4 mr-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Scroll to load more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
