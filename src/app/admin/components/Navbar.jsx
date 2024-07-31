import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    return (
        <div className="bg-white shadow-md p-4 flex justify-end items-center sticky top-0">
            
            <Link href="/" className="flex items-center text-blue-500">
                Go to Website <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2 max-w-5 max-h-5" />
            </Link>
        </div>
    );
};

export default Navbar;
