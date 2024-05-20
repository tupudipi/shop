import Navbar from "../components/Navbar";
import AccountSidebar from "../components/AccountSidebar";

export const metadata = {
    title: 'Account - Cico Shop',
    description: 'Your account on Cico Shop',
    keywords: 'cico shop, account'
}

export default function RootLayout({ children }) {
    return (
        <>
            <Navbar />
            <main className="container mx-auto flex flex-col md:flex-row px-4 pb-4 gap-4 md:gap-8 lg:gap-24">
                <AccountSidebar />
                {children}
            </main>
        </>
    )
}