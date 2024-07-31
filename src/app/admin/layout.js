import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from '@/firebaseInit';
import { doc, getDoc } from 'firebase/firestore';
import { redirect } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

export default async function AdminLayout({ children }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return redirect('/');
    }
    const docRef = doc(db, 'Users', session.user.email);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return redirect('/');
    }
    const user = docSnap.data();
    if (user.role !== 'admin') {
        return redirect('/');
    }
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-64"> 
                <Navbar />
                <main className="flex-1 p-6 bg-gray-100">
                    {children}
                </main>
            </div>
        </div>
    );
}

