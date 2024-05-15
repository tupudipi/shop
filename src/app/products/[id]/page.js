import Navbar from "@/app/components/Navbar"

const productPage = ({ params }) => {
    const productId = params.id;
    return (
        <>
            <Navbar />
            <main className="flex min-h-screen flex-col items-center">
                {/* product image gallery */}
                
                <h1 className="text-4xl font-bold">Product {productId}</h1>
            </main>
        </>
    )
}

export default productPage