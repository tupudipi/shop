'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { signIn } from 'next-auth/react';
import { mergeWishlistAndCart } from '@/utils/mergeData';


const handleSignIn = async () => {
    console.log('Sign-in process started'); 
    try {
      const result = await signIn('google', { redirect: false });
      console.log('Sign-in result:', result); 
      if (result?.ok) {
        console.log('Signed in successfully');
        if (result.user && result.user.email) {
          console.log('Attempting to merge data for:', result.user.email);
          await mergeWishlistAndCart(result.user.email);
          console.log('Merge completed');
        } else {
          console.error('User email not found in result');
        }
      } else {
        console.error('Failed to sign in');
      }
    } catch (error) {
      console.error('Error during sign in process:', error);
    }
  };

const LoginModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full  max-w-80 md:max-w-md z-50 relative">
                <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Cico Shop</h2>
                <div className="flex flex-col gap-4 text-justify
                ">
                    <p>Sign in to access exclusive features, and the most purrfect seamless shopping experience.</p>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" onClick={() => handleSignIn()}>
                        <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                        Login with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
