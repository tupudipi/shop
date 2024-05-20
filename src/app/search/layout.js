import Navbar from '../components/Navbar'
import Filters from '../components/Filters'

export const metadata = {
    title: 'Search for products - Cico Shop',
    description: 'Explore products on Cico Shop',
    keywords: 'cico shop, products'
}

export default function RootLayout({ children }) {
    return (
        <>
            <Navbar />
            <main className="flex flex-col md:flex-row w-full container mx-auto">
                <div className="text-center md:w-1/5 border border-green-600 p-4"><Filters></Filters></div>
                <div className="flex-grow text-center border-red-600 border p-4">
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
                    {children}
                </div>
            </main>

        </>
    )
}