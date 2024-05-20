import ProductCard from "./ProductCard"

const Results = () => {
  return (
    <div>
        <div id="sorting">
            <div className="flex justify-around">
                <div className="flex items-center">
                    <label htmlFor="sort">Sort by:</label>
                    <select name="sort" id="sort" className="mx-2">
                        <option value="relevance">Relevance</option>
                        <option value="date">Date</option>
                        <option value="popularity">Popularity</option>
                    </select>
                </div>
                <div className="flex items-center">
                    <label htmlFor="order">Order:</label>
                    <select name="order" id="order" className="mx-2">
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>
        </div>

        <div id="results" className="flex  flex-col md:flex-row md:flex-wrap gap-3 mt-2">
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
        </div>
    </div>
  )
}

export default Results