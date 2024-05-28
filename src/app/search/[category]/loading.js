import ProductLoading from "@/app/components/ProductLoading"

const loading = () => {
    return (
        <div className="flex flex-wrap gap-4 mt-2">
            {[...Array(4)].map((_, i) => (
                <ProductLoading key={i} />
            ))}
        </div>
    )
}

export default loading