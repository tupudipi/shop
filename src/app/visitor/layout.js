import Navbar from "../components/Navbar";
import VisitorSidebar from "../components/VisitorSidebar";

export const metadata = {
    title: 'Visitor - Cico Shop',
    description: 'Your visitor account on Cico Shop',
    keywords: 'cico shop, account'
}

export default async function RootLayout({ children }) {

    return (
        <>
            <Navbar />
            <main className="container mx-auto flex flex-col md:flex-row px-4 pb-4 gap-4 md:gap-8 lg:gap-24">
                {
                    <>
                        <VisitorSidebar />
                        {children}
                    </>

                }
            </main>
        </>
    )
}