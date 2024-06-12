'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import ProductCard from "./ProductCard";
import Link from "next/link";
import ProductLoading from './ProductLoading';

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

const CategoryShow = ({ page, categoryID, currentProductSlug }) => {
    const scrollContainer = useRef(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Event handler for resizing
    const handleResize = debounce(() => {
        setIsSmallScreen(window.innerWidth < 1280);
    }, 250); // 250ms debounce time

    useEffect(() => {
        // Set the initial value based on the window's width
        setIsSmallScreen(window.innerWidth < 1280);

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

    // Fetch products based on the categoryID
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true); // Set loading to true
            try {
                let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`;
                let params = new URLSearchParams();

                if (categoryID) {
                    params.append('categoryID', categoryID);
                }

                if (currentProductSlug) {
                    params.append('currentProductSlug', currentProductSlug);
                }

                if (params.toString()) {
                    url += `?${params.toString()}`;
                }

                const res = await fetch(url);
                if (!res.ok) throw new Error('Failed to fetch products');
                let data = await res.json();

                if (currentProductSlug) {
                    data = data.filter(product => product.slug !== currentProductSlug);
                }

                setProducts(data.slice(0, 5)); // Only take the first 5 products
            } catch (error) {
                console.error(error);
            }
            setIsLoading(false); // Set loading to false
        };

        fetchProducts();
    }, [categoryID, currentProductSlug]);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${categoryID}`);
                if (!res.ok) throw new Error('Failed to fetch category');
                const data = await res.json();
                setCategory(data);
            } catch (error) {
                console.error(error);
            }
        };

        if (categoryID) {
            fetchCategory();
        }
    }, [categoryID]);

    // console.log(category?.category_name);

    return (
        <div className="my-6">
            <h2 className="text-2xl mb-4 font-medium capitalize">
                {page === 'home' ? category?.category_name : 'Related Products'}
            </h2>
            <div
                ref={scrollContainer}
                className="flex gap-6 max-w-sm md:max-w-3xl overflow-auto pb-6 lg:max-w-5xl xl:max-w-7xl mb-2"
                style={{ scrollBehavior: 'smooth' }}
            >
                {isLoading ? (
                    <><ProductLoading /> <ProductLoading /> <ProductLoading /> </>
                ) : (
                    <>
                        {products.map((product) => (
                            <ProductCard key={product.slug} product={product} />
                        ))}
                    </>
                )}
            </div>
            <Link href={`/search/${category?.category_name}`}>
                <p className="text-blue-500 hover:underline hover:text-blue-700">
                    View all products in this category
                </p>
            </Link>
        </div>
    );
};

export default CategoryShow;
