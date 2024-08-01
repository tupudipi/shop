'use client';
import { useState, useEffect } from 'react';

export default function Toast({ message, isLoading, duration = 2000 }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            if (!isLoading) {
                const timer = setTimeout(() => {
                    setIsVisible(false);
                }, duration);
                return () => clearTimeout(timer);
            }
        }
    }, [message, isLoading, duration]);

    if (!isVisible) return null;

    return (
        <div className={`fixed bottom-5 right-5 px-4 py-2 rounded shadow-lg transition-all duration-500 ease-in-out transform ${isVisible ? 'translate-y-0' : 'translate-y-full'} ${isLoading ? 'bg-yellow-500' : 'bg-green-500'}`}>
            <div className="flex items-center">
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-white">Saving data...</span>
                    </>
                ) : (
                    <>
                        <svg className="h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white">{message}</span>
                    </>
                )}
            </div>
            {!isLoading && (
                <div 
                    className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-70"
                    style={{
                        width: '100%',
                        animation: `shrink ${duration}ms linear forwards`
                    }}
                />
            )}
            <style jsx>{`
                @keyframes shrink {
                    from { transform: scaleX(1); }
                    to { transform: scaleX(0); }
                }
                @keyframes slideIn {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
