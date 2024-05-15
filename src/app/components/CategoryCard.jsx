import Link from "next/link"

const CategoryCard = () => {
    return (
        <>
            <Link href="/search?cat=1" className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow align-middle flex-grow group">
                <div className='self-center flex flex-col gap-4'>
                    <div className="w-48 h-48 bg-gray-200 rounded-lg relative">
                        <h3 className="text-lg font-semibold absolute bottom-1 w-full text-center group-hover:bottom-4 transition-all ease-in-out">Category 1</h3>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default CategoryCard