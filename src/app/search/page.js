import ProductCard from "../components/ProductCard"

const searchPage = () => {
    return (

        <div id="results" className="flex  flex-col md:flex-row md:flex-wrap gap-3 mt-2">
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
        </div>

    )
}

export default searchPage