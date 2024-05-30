'use client'

export default function AddToFavouritesButton({ product }) {
    function addToWishlist(product) {
        // Get the current wishlist from local storage
        let wishlist = localStorage.getItem('wishlist');
        if (wishlist) {
            wishlist = JSON.parse(wishlist);
        } else {
            wishlist = [];
        }

        // Check if the product is already in the wishlist
        const productExists = wishlist.some(wishlistProduct => wishlistProduct.slug === product.slug);

        // If the product is not in the wishlist, add it
        if (!productExists) {
            wishlist.push(product);

            // Save the updated wishlist back to local storage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }

    return (
        <button className="bg-gray-200 text-gray-800 px-4 py-1 rounded-lg hover:bg-gray-300 transition-colors" onClick={() => addToWishlist(product)}>Add to favourites</button>
    );
}