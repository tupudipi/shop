import Navbar from "../components/Navbar"
import Filters from "../components/Filters"
import Results from "../components/Results"

const searchPage = () => {
    return (
        <>
            <Navbar />
            <main className="flex flex-col md:flex-row w-full">
                <div className="text-center md:w-1/5 border border-green-600 p-4"><Filters></Filters></div>
                <div className="flex-grow text-center border-red-600 border p-4"><Results></Results></div>
            </main>
        </>
    )
}

export default searchPage