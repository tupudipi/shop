'use client';

export default function ProductQuantity({ quantity, setQuantity }) {
    const decreaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity > 1 ? prevQuantity - 1 : 1);
    };

    const increaseQuantity = () => {
        setQuantity(prevQuantity => Number(prevQuantity) + 1);
    };

    return (
        <div className='flex gap-1'>
            <button className="bg-gray-200 text-gray-800 px-4 py-1 rounded-lg hover:bg-gray-300 transition-colors" onClick={decreaseQuantity}>-</button>
            <input className="flex-grow min-w-0 text-center appearance-none border" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            <button className="bg-gray-200 text-gray-800 px-4 py-1 rounded-lg hover:bg-gray-300 transition-colors" onClick={increaseQuantity}>+</button>
        </div>
    );
}
