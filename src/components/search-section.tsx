import React, { useState } from 'react';
import { SearchInput } from './ui/search-input';

interface SearchSectionProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export function SearchSection({ onSearch, placeholder = "Search..." }: SearchSectionProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (onSearch) {
      setIsLoading(true);
      onSearch(value);
      // Reset loading state after a brief delay
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <SearchInput
        value={query}
        onChange={handleSearch}
        placeholder={placeholder}
        disabled={isLoading}
      />
      {isLoading && (
        <div className="mt-2 text-sm text-gray-500 text-center">
          Searching...
        </div>
      )}
    </div>
  );
}