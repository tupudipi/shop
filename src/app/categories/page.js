import Navbar from "../components/Navbar"
import CategoryCard from "../components/CategoryCard"

const categoriesPage = () => {
    return (
        <>
            <Navbar />
            <main className="flex min-h-screen flex-col items-center">
                <h1 className="text-4xl font-bold">Categories</h1>
                <div className="flex gap-4 mt-8 flex-wrap items-center px-16">
                    <CategoryCard />
                    <CategoryCard />
                    <CategoryCard />
                    <CategoryCard />
                    <CategoryCard />
                    <CategoryCard />
                    <CategoryCard />
                    <CategoryCard />
                    <CategoryCard />
                </div>
            </main>
        </>
    )
}

export default categoriesPage