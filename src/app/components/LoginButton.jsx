'use client';

import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faRightFromBracket, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { db } from '@/firebaseInit';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginButton() {
    const { data: session } = useSession();
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        if (session) {
            const fetchUserRole = async () => {
                const docRef = doc(db, 'Users', session.user.email);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const user = docSnap.data();
                    setUserRole(user.role);
                }
            };
            fetchUserRole();
        }
    }, [session]);

    const openLoginModal = () => setLoginModalOpen(true);
    const closeLoginModal = () => setLoginModalOpen(false);

    return (
        <div>
            {session ? (
                <div className='flex justify-around gap-3 md:gap-5 items-center'>
                    {userRole === 'admin' && (
                        <Link href='/admin' className='bg-sky-500 text-white px-3 py-1 rounded-lg hover:bg-sky-700 transition-colors text-sm md:text-base'>
                            <FontAwesomeIcon icon={faScrewdriverWrench} className="max-h-4" /> Admin
                        </Link>
                    )}
                    <button
                        onClick={() => signOut()}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
                    >
                        <FontAwesomeIcon icon={faRightFromBracket} className="max-h-4" /> Sign out
                    </button>
                </div>
            ) : (
                <button
                    onClick={openLoginModal}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-800 transition-colors"
                >
                    <FontAwesomeIcon icon={faRightToBracket} className="max-h-4" /> Sign in / Sign Up
                </button>
            )}
            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </div>
    );
}