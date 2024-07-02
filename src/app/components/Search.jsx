'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from 'react';
import { db } from '@/firebaseInit';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState(null);
    const searchRef = useRef(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                performSearch();
            } else {
                setSearchResults([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const performSearch = async () => {
        setIsLoading(true);
        setError(null);
        setShowDropdown(true);
        console.log('Performing search for:', searchTerm);

        const searchTermLower = searchTerm.toLowerCase();

        try {
            const productsRef = collection(db, 'Products');
            const categoriesRef = collection(db, 'Categories');

            const [productsSnapshot, categoriesSnapshot] = await Promise.all([
                getDocs(productsRef),
                getDocs(categoriesRef)
            ]);

            const products = productsSnapshot.docs
                .map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.name || '',
                        type: 'product',
                        ...data
                    };
                })
                .filter(product => product.name.toLowerCase().includes(searchTermLower));

            const categories = categoriesSnapshot.docs
                .map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.category_name || '',
                        type: 'category',
                        ...data
                    };
                })
                .filter(category => category.name.toLowerCase().includes(searchTermLower));

            const results = [...products, ...categories]
                .sort((a, b) => a.name.toLowerCase().indexOf(searchTermLower) - b.name.toLowerCase().indexOf(searchTermLower))
                .slice(0, 10);

            console.log('Search results:', results);
            setSearchResults(results);
        } catch (error) {
            console.error('Error searching:', error);
            setError('An error occurred while searching. Please try again.');
        }
        setIsLoading(false);
    };

    return (
        <div className="relative" ref={searchRef}>
            <div className="relative">
                <input
                    className="w-full p-2 px-4 rounded-full pr-10 shadow active:shadow-md"
                    type="search"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute top-1/2 transform -translate-y-1/2 right-3 h-5 w-5 text-gray-500 flex items-center justify-center cursor-pointer hover:text-indigo-900 transition-all">
                    <FontAwesomeIcon icon={faSearch} />
                </div>
            </div>
            {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                    {isLoading && (
                        <div className="p-4 text-center">
                            Loading...
                        </div>
                    )}
                    {!isLoading && error && (
                        <div className="p-4 text-center text-red-500">
                            {error}
                        </div>
                    )}
                    {!isLoading && !error && searchResults.length === 0 && (
                        <div className="p-4 text-center">
                            No results found
                        </div>
                    )}
                    {!isLoading && !error && searchResults.map((result) => (
                        <Link
                            key={`${result.type}-${result.id}`}
                            href={result.type === 'product' ? `/products/${result.id}` : `/categories/${result.id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                            {result.type === 'product' && result.image && (
                                <div className="w-10 h-10 mr-3 relative">
                                    <Image
                                        src={result.image}
                                        alt={result.name}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded"
                                    />
                                </div>
                            )}
                            <div>
                                <div>{result.name || 'Unnamed'}</div>
                                { result.type === 'category' && (<div className="text-xs text-gray-500">{result.type}</div>) }
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;