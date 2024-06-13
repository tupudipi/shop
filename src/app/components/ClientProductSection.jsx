'use client';

import { useState } from 'react';
import ProductQuantity from './ProductQuantity';
import AddToCartButton from './AddToCartButton';
import AddToFavouritesButton from './AddToFavouritesButton';

export default function ClientProductSection({ product }) {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="md:w-3/4 lg:w-2/3 flex flex-col gap-2">
            <ProductQuantity quantity={quantity} setQuantity={setQuantity} />
            <AddToCartButton product={product} quantity={quantity} setQuantity={setQuantity}/>
            <AddToFavouritesButton product={product} />
        </div>
    );
}
