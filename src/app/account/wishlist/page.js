import ProductCard from "@/app/components/ProductCard"


const wishlistPage = () => {
  return (
    <div>
      <h1 className="text-4xl font-medium">Wishlist</h1>
      <div className="mt-6 flex items-center gap-2 md:gap-4 flex-wrap">
          <ProductCard isFav/>
          <ProductCard isFav/>
          <ProductCard isFav/>
      </div>
    </div>
  )
}

export default wishlistPage