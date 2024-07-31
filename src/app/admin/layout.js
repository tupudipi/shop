import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from '@/firebaseInit';
import { doc, getDoc } from 'firebase/firestore';
import { redirect } from "next/navigation";

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
        <>
            <div>
                <h1>Hello admin</h1>
                {children}
            </div>
        </>
    )
}

