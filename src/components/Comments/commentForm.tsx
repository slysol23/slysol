'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface CommentFormProps {
  blogId: number;
  parentId?: number | null;
  onCancel?: () => void;
  placeholder?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  blogId,
  parentId = null,
  onCancel,
  placeholder = 'Write your comment...',
}) => {
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
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to post comment');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      alert('Name and comment are required');
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
      className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder={placeholder}
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={commentMutation.isPending}
            className="px-6 py-2 bg-blue-500 text-black rounded-md hover:bg-gray-500 bg-gray-200 disabled:cursor-not-allowed transition-all font-medium shadow-sm"
          >
            {commentMutation.isPending
              ? 'Posting...'
              : parentId
              ? 'Post Reply'
              : 'Post Comment'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-500 transition-all font-medium shadow-sm"
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
