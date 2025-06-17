'use client';

import React, { createContext, useContext, useState } from 'react';

type SearchContextType = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isSearching: boolean;
    setIsSearching: (isSearching: boolean) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery, isSearching, setIsSearching }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
} 