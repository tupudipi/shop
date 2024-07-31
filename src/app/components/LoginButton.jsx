'use client';

import { useState } from 'react';
import LoginModal from './LoginModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightToBracket, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useSession, signOut } from 'next-auth/react';

export default function LoginButton() {
    const { data: session } = useSession();
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);

    const openLoginModal = () => setLoginModalOpen(true);
    const closeLoginModal = () => setLoginModalOpen(false);

    return (
        <div>

            {session ?
                <button
                    onClick={() => signOut()}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <FontAwesomeIcon icon={faRightFromBracket} className="max-h-4"/> Sign out
                </button> :
                <button
                    onClick={openLoginModal}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <FontAwesomeIcon icon={faRightToBracket} className="max-h-4"/> Sign in / Sign Up
                </button>
            }


            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </div>
    );
}
