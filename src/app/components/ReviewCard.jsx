'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faReply } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import Image from 'next/image';

const fetchAuthorName = async (author) => {
  const usersCollection = collection(db, 'Users');
  const q = query(usersCollection, where('email', '==', author));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0].data().name;
};
const fetchAuthorImg = async (author) => {
  const usersCollection = collection(db, 'Users');
  const q = query(usersCollection, where('email', '==', author));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0].data().image;
};


const ReviewCard = ({ review }) => {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorImg, setAuthorImg] = useState('');
  useEffect(() => {
    fetchAuthorName(review.author).then(name => setAuthorName(name));
    fetchAuthorImg(review.author).then(img => setAuthorImg(img));
  });

  return (
    <div className="mb-6 md:flex md:gap-6 border-b pb-4">
      <div id="reviewHeader" className="flex flex-col gap-1 md:max-w-36 text-center">
        <div id="userData" className="flex gap-2 items-center md:flex-col">
          <div id="userImg" className="bg-gray-300 rounded-full w-8 h-8">
            <Image src={authorImg} alt="User" className="rounded-full" width={32} height={32}/>
          </div>

          <div id="userName">
            <p className='truncate'>{authorName}</p>
          </div>
        </div>
        <div id="date" className="text-gray-700">
          <p>{review.date.toLocaleString()}</p>
        </div>
      </div>

      <div id="reviewContent">
        <div id='grade' className="my-2 flex gap-4 items-center">
          <div className="flex gap-1 items-center">
            {[...Array(review.grade)].map((_, index) => (
              <div key={index} className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            ))}
            {[...Array(5 - review.grade)].map((_, index) => (
              <div key={index} className="w-3 h-3 bg-gray-300 rounded-full"></div>
            ))}
          </div>
          <p className="text-sm">{review.grade}.0</p>
        </div>

        <div id='reviewText' className="leading-7 text-gray-900">
          <p className="truncate">{review.content}</p>
        </div>

        <div id="reviewFooter" className="mt-2 flex gap-4">
          <div className="flex gap-2">
            <p className="pr-2 border-r">{review.likes}</p>
            <button><FontAwesomeIcon icon={faThumbsUp} className="transition-all ease-in-out hover:text-indigo-700 active:translate-y-1" /></button>
          </div>
          <button
            onClick={() => setShowResponseForm(!showResponseForm)}
          >
            <FontAwesomeIcon icon={faReply} className="transition-all ease-in-out hover:text-indigo-700 active:translate-y-1" />
          </button>
          <button><FontAwesomeIcon icon={faFlag} className="transition-all ease-in-out hover:text-indigo-700 active:translate-y-1" /></button>
        </div>
        <div
          className={`transition-all duration-500 ease-in-out ${showResponseForm ? 'max-h-screen' : 'max-h-0'
            } overflow-hidden`}
        >
          {showResponseForm && (
            <div className="mt-4 p-2">
              <textarea
                className="w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-30 mb-2 transition-all m-1"
                rows="4"
                placeholder="Your response"
              ></textarea>
              <button
                className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
