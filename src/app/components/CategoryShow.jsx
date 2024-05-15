'use client'

import { useRef, useState, useEffect } from 'react';
import ProductCard from "./ProductCard";
import Link from "next/link";

// Debounce function to limit the rate at which a function can fire.
const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
};

const CategoryShow = ({ page }) => {
    const scrollContainer = useRef(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Event handler for resizing
    const handleResize = debounce(() => {
        setIsSmallScreen(window.innerWidth < 1280);
    }, 250); // 250ms debounce time

    useEffect(() => {
        // Set the initial value based on the window's width
        setIsSmallScreen(window.innerWidth < 1280);

        const handleResize = debounce(() => {
            setIsSmallScreen(window.innerWidth < 1280);
        }, 250);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    useEffect(() => {
        const handleWheel = (event) => {
            if (isSmallScreen) {
                event.preventDefault();
                if (scrollContainer.current) {
                    scrollContainer.current.scrollLeft += event.deltaY;
                }
            }
        };

        const container = scrollContainer.current;
        if (isSmallScreen) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (isSmallScreen) {
                container.removeEventListener('wheel', handleWheel);
            }
        };
    }, [isSmallScreen]);

    return (
        <div className="my-6">
            <h2 className="text-2xl mb-4">
                {page === 'home' ? 'Category Name' : 'Related Products'}
                </h2>
            <div ref={scrollContainer} className="flex gap-6 max-w-sm
            md:max-w-3xl overflow-auto pb-6 lg:max-w-5xl xl:max-w-7xl mb-2" style={{ scrollBehavior: 'smooth' }}>
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
            </div>
            <Link href="/search?cat=1">
                <p className="text-blue-500 hover:underline hover:text-blue-700">View all products in this category</p>
            </Link>
        </div>
    );
};

export default CategoryShow;



