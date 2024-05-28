
const ProductLoading = () => {
    return (
        <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow items-center animate-pulse">
            <div className="animate-pulse">
                <div className="h-40 w-40 bg-gray-300 rounded-lg"></div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="animate-bounce">
                    <div className="h-6 w-48 bg-gray-300 rounded"></div>
                </div>
                <div id="star-review" className="flex justify-between gap-3">
                    <div className="flex gap-1 animate-bounce">
                        <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse"></div>
                        <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse"></div>
                        <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse"></div>
                        <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse"></div>
                        <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-sm" animate-bounce>
                        <div className="h-4 w-12 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 animate-bounce">
                    <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-8 w-24 bg-blue-500 rounded-lg animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default ProductLoading;
