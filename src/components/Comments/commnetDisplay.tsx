'use client';

import React, { useState } from 'react';
import { FaReply, FaUser, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IComment } from 'lib/type';
import CommentForm from './commentForm';

interface CommentDisplayProps {
  comment: IComment;
  blogId: number;
  depth?: number;
}

const CommentDisplay: React.FC<CommentDisplayProps> = ({
  comment,
  blogId,
  depth = 0,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [openReplies, setOpenReplies] = useState(false);
  const replyCount = comment.replies?.length || 0;

  const commentDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 8);
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-6'}`}>
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-black">
            <FaUser size={16} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">
                {comment.name}
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-2">
              {commentDate(comment.createdAt)}
            </p>

            <p className="text-black whitespace-pre-wrap">{comment.comment}</p>

            {comment.is_published && depth < 3 && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="mt-3 text-sm text-black hover:text-blue font-medium flex items-center gap-1 transition-colors"
              >
                <FaReply size={12} /> {showReplyForm ? 'Cancel Reply' : 'Reply'}
              </button>
            )}

            {replyCount > 0 && (
              <button
                onClick={() => setOpenReplies(!openReplies)}
                className="mt-3 flex items-center gap-2 text-sm bg-gray-200 text-black hover:bg-gray-400 font-medium px-3 py-1 rounded-md shadow-sm transition-all"
              >
                {openReplies ? <FaChevronUp /> : <FaChevronDown />}
                <span className=" text-black text-xs px-2 py-0.5 rounded-full">
                  {replyCount}
                </span>
                {openReplies ? 'Hide Replies' : 'Show Replies'}
              </button>
            )}
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className="mt-4 ml-8">
          <CommentForm
            blogId={blogId}
            parentId={comment.id}
            type="reply"
            onCancel={() => setShowReplyForm(false)}
            placeholder={`Reply to ${comment.name}...`}
          />
        </div>
      )}

      {openReplies && replyCount > 0 && (
        <div className="mt-3 ml-6 border-l border-gray-300 pl-4">
          {comment.replies.map((reply) => (
            <CommentDisplay
              key={reply.id}
              comment={reply}
              blogId={blogId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentDisplay;
