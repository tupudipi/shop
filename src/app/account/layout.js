import Navbar from "../components/Navbar";
import AccountSidebar from "../components/AccountSidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const metadata = {
    title: 'Account - Cico Shop',
    description: 'Your account on Cico Shop',
    keywords: 'cico shop, account'
}

export default async function RootLayout({ children }) {
    const session = await getServerSession(authOptions);

    return (
        <>
            <Navbar />
            <main className="container mx-auto flex flex-col md:flex-row px-4 pb-4 gap-4 md:gap-8 lg:gap-24">
                {
                    session ? (
                        <>
                            <AccountSidebar />
                            {children}
                        </>
                    ) : (
                        <div className="container">
                            <h1 className="text-xl font-medium">You must be logged in to access your account.</h1>
                        </div>
                    )
                }
            </main>
        </>
    )
}