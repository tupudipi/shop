import ProductCard from "@/app/components/ProductCard"


const wishlistPage = () => {
  return (
    <div>
      <h1 className="text-4xl font-medium">Wishlist</h1>
      <div className="mt-6 flex flex-col gap-3 px-8 md:flex-row md:p-0 md:flex-wrap">
          {/* <ProductCard isFav/>
          <ProductCard isFav/>
          <ProductCard isFav/> */}
      </div>
    </div>
  )
}

export default wishlistPage