import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from '@/firebaseInit';
import { doc, getDoc } from 'firebase/firestore';
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";

export default async function AdminPage() {
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
        <>
            <Navbar />
            <main className="flex min-h-screen flex-col items-center justify-between">
                <h1 className="text-4xl font-bold">Hello, Admin!</h1>
            </main>
        </>
    )
}

