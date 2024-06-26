import React from 'react';
import Image from 'next/image';

const ReplyCard = ({ reply }) => {
  return (
    <div className="mb-2 p-2 bg-gray-100 rounded">
      <div className="flex items-center mb-1">
        <Image 
          src={reply.authorImg || '/default-avatar.png'} 
          alt={reply.authorName || 'User'} 
          className="rounded-full mr-2" 
          width={24} 
          height={24} 
        />
        <span className="font-semibold">{reply.authorName || reply.author}</span>
      </div>
      <p className="text-sm">{reply.content}</p>
      <p className="text-xs text-gray-500 mt-1">{new Date(reply.date).toLocaleString()}</p>
    </div>
  );
};

export default ReplyCard;