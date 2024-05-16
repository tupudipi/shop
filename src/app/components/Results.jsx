
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
    </div>
  )
}

export default Results