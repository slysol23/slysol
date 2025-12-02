'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IComment } from 'lib/type';
import CommentDisplay from './commnetDisplay';
import CommentForm from './commentForm';

interface CommentsProps {
  blogId: number;
}

const mapBackendComment = (backendComment: any): IComment => ({
  ...backendComment,
  replies: (backendComment.replies || []).map(mapBackendComment),
});

export default function Comments({ blogId }: CommentsProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['comments', blogId],
    queryFn: async () => {
      const response = await axios.get('/api/comments', {
        params: { blogId, published: true },
      });
      return response.data;
    },
  });

  const commentsList: IComment[] = (data?.data || [])
    .map(mapBackendComment)
    .sort(
      (a: IComment, b: IComment) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <div className="mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Comments</h2>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {commentsList.length}{' '}
          {commentsList.length === 1 ? 'Comment' : 'Comments'}
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            Failed to load comments. Please try again later.
          </div>
        ) : commentsList.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">
              No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-12">
            {commentsList.map((comment) => (
              <CommentDisplay
                key={comment.id}
                comment={comment}
                blogId={blogId}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mb-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Leave a Comment
        </h3>
        <CommentForm blogId={blogId} />
      </div>
    </div>
  );
}
