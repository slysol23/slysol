'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

interface CommentFormProps {
  blogId: number;
  parentId?: number | null; // null = main comment, number = reply
  onCancel?: () => void;
  placeholder?: string;
  type?: 'comment' | 'reply';
}

const CommentForm: React.FC<CommentFormProps> = ({
  blogId,
  parentId = null,
  onCancel,
  placeholder = 'Write your comment...',
}) => {
  const isReply = parentId !== null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  const commentMutation = useMutation({
    mutationFn: async (data: {
      blogId: number;
      parentId: number | null;
      name: string;
      email: string | null;
      comment: string;
    }) => {
      const response = await axios.post('/api/comments', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    },

    onSuccess: () => {
      setName('');
      setEmail('');
      setComment('');

      if (isReply) {
        toast.success('Your reply has been sent to the publisher for review');
      } else {
        toast.success('Your comment has been sent to the publisher for review');
      }

      if (onCancel) onCancel();
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to post comment');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast.error('Name and comment are required');
      return;
    }

    commentMutation.mutate({
      blogId,
      parentId,
      name: name.trim(),
      email: email.trim() || null,
      comment: comment.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-lg shadow-lg border border-gray-200"
    >
      <div className="space-y-4">
        {/* Name + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="your@email.com"
            />
          </div>
        </div>

        {/* Comment / Reply */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isReply ? 'Reply' : 'Comment'}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border rounded-md resize-none"
            placeholder={placeholder}
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={commentMutation.isPending}
            className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            {commentMutation.isPending
              ? 'Saving...'
              : isReply
              ? 'Reply'
              : 'Comment'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
