'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc, addDoc } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import ConfirmationModal from './ConfirmationModal';
import ReplyCard from './ReplyCard';

const ReviewCard = ({ review, handleDeleteReview, product_id }) => {
  const { data: session } = useSession();
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorImg, setAuthorImg] = useState('');
  const [liked, setLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [likeCount, setLikeCount] = useState(review.likes);

  const memoizedFetchAuthorName = useMemo(() => {
    const cache = new Map();
    return async (author) => {
      if (cache.has(author)) return cache.get(author);
      const usersCollection = collection(db, 'Users');
      const q = query(usersCollection, where('email', '==', author));
      const querySnapshot = await getDocs(q);
      const name = querySnapshot.docs[0].data().name;
      cache.set(author, name);
      return name;
    };
  }, []);

  const memoizedFetchAuthorImg = useMemo(() => {
    const cache = new Map();
    return async (author) => {
      if (cache.has(author)) return cache.get(author);
      const usersCollection = collection(db, 'Users');
      const q = query(usersCollection, where('email', '==', author));
      const querySnapshot = await getDocs(q);
      const image = querySnapshot.docs[0].data().image;
      cache.set(author, image);
      return image;
    };
  }, []);

  const handleLike = useCallback(async () => {
    if (!session) return;
  
    const reviewRef = doc(db, 'Reviews', review.id);
    const reviewDoc = await getDoc(reviewRef);
  
    if (reviewDoc.exists()) {
      const currentLikes = reviewDoc.data().likes;
      const likedByArray = reviewDoc.data().likedBy || [];
  
      if (liked) {
        await updateDoc(reviewRef, {
          likes: currentLikes - 1,
          likedBy: arrayRemove(session.user.email)
        });
        setLiked(false);
        setLikeCount(prevCount => prevCount - 1);
      } else {
        await updateDoc(reviewRef, {
          likes: currentLikes + 1,
          likedBy: arrayUnion(session.user.email)
        });
        setLiked(true);
        setLikeCount(prevCount => prevCount + 1);
      }
    }
  }, [session, review.id, liked]);

  useEffect(() => {
    const fetchData = async () => {
      const name = await memoizedFetchAuthorName(review.author);
      setAuthorName(name);
      const img = await memoizedFetchAuthorImg(review.author);
      setAuthorImg(img);

      if (session) {
        setLiked((review.likedBy || []).includes(session.user.email));
      }
    };

    fetchData();
  }, [review.author, review.likedBy, session, memoizedFetchAuthorName, memoizedFetchAuthorImg]);

  const handleReplySubmit = async (event) => {
    event.preventDefault();
    if (!session) return;
  
    const replyData = {
      author: session.user.email,
      authorName: session.user.name, 
      authorImg: session.user.image, 
      content: event.target.reply.value,
      date: new Date().toISOString(),
    };
  
    try {
      const repliesRef = collection(db, 'Reviews', review.id, 'replies');
      await addDoc(repliesRef, replyData);
      
      fetchReplies();
      
      event.target.reply.value = '';
      setShowResponseForm(false);
    } catch (error) {
      console.error("Error adding reply: ", error);
    }
  };

  const fetchReplies = async () => {
    try {
      const repliesRef = collection(db, 'Reviews', review.id, 'replies');
      const repliesSnapshot = await getDocs(repliesRef);
      const fetchedReplies = repliesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReplies(fetchedReplies);
    } catch (error) {
      console.error("Error fetching replies: ", error);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [review.id]);

  const confirmDelete = () => {
    handleDeleteReview(review.id, product_id, review.rating);
    setShowModal(false);
  };
  return (
    <div className="mb-6 md:flex md:gap-6 border-b pb-4">
      <div id="reviewHeader" className="flex flex-col gap-1 md:max-w-36 text-center">
        <div id="userData" className="flex gap-2 items-center md:flex-col">
          <div id="userImg" className="bg-gray-300 rounded-full w-8 h-8">
            <Image src={authorImg} alt="User" className="rounded-full" width={32} height={32} />
          </div>
          <div id="userName">
            <p className='truncate'>{authorName}</p>
          </div>
        </div>
        <div id="date" className="text-gray-700 text-start md:text-center text-sm">
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
          <div className="flex gap-2 items-center">
            <p className="pr-2 border-r">{likeCount}</p>
            <button
              onClick={session ? handleLike : null}
              className={`${session ? '' : 'text-gray-400'}`}
              disabled={!session}
            >
              <FontAwesomeIcon
                icon={faThumbsUp}
                className={`${session ? 'hover:text-indigo-700 active:translate-y-1' : ''} transition-all ease-in-out ${liked ? 'text-blue-400 filter drop-shadow-[0_0_2px_rgba(59,130,246,0.6)]' : ''}`}
              />
            </button>
          </div>
          <button
            onClick={session ? () => setShowResponseForm(!showResponseForm) : null}
            className={`${session ? '' : 'text-gray-400'}`}
            disabled={!session}
          >
            <FontAwesomeIcon icon={faReply} className={`transition-all ease-in-out ${session ? 'hover:text-indigo-700 active:translate-y-1' : ''}`} />
          </button>
          {session && session.user.email === review.author && (
            <button onClick={() => setShowModal(true)}>
              <FontAwesomeIcon icon={faTrashAlt} className="transition-all ease-in-out hover:text-indigo-700 active:translate-y-1" />
            </button>
          )}
          <div>
            <button
              onClick={() => setShowReplies(!showReplies)}
              className={`text-blue-500 ${replies.length > 0 ? ('hover:text-blue-700') : ('')} text-sm`}
              {...(replies.length === 0 && { disabled: true })}
            >
              {showReplies ? 'Hide Replies' : `Show Replies (${replies.length})`}
            </button>
          </div>
        </div>
        {showResponseForm && (
          <form onSubmit={handleReplySubmit} className="mt-4">
            <textarea
              name="reply"
              className="w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-30 mb-2"
              rows="3"
              placeholder="Your reply"
              required
            ></textarea>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700"
            >
              Submit Reply
            </button>
          </form>
        )}
        {showReplies && (
          <div className="ml-8 mt-2">
            {replies.map(reply => (
              <ReplyCard key={reply.id} reply={reply} />
            ))}
          </div>
        )}
        <div
          className={`transition-all duration-500 ease-in-out ${showResponseForm ? 'max-h-screen' : 'max-h-0'} overflow-hidden`}
        >
        </div>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this review?"
      />
    </div>
  );
};

export default ReviewCard;
