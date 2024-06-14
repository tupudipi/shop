'use client';

import { useState } from 'react';
import LoginModal from './LoginModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function LoginButton() {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);

    const openLoginModal = () => setLoginModalOpen(true);
    const closeLoginModal = () => setLoginModalOpen(false);

    return (
        <div>
            <button
                onClick={openLoginModal}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
            >
                <FontAwesomeIcon icon={faUser} /> Sign in / Sign Up
            </button>

            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </div>
    );
}
