'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import { comments } from 'lib/comments';
import { toast } from 'react-toastify';

const CommentSchema = z.object({
  blogId: z.number().min(1, 'Blog ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  comment: z.string().min(2, 'Comment must be at least 2 characters'),
});

type CommentForm = z.infer<typeof CommentSchema>;

export default function EditCommentPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const queryClient = useQueryClient();

  // Fetch comment
  const { data, isLoading, isError } = useQuery({
    queryKey: ['comment', id],
    queryFn: async () => {
      const res = await comments.getById(id);
      return res.data;
    },
    enabled: !isNaN(id),
  });

  // Update comment
  const updateComment = useMutation({
    mutationFn: (formData: CommentForm) => comments.update(id, formData),
    onSuccess: () => {
      toast.success('Comment updated successfully!');
      router.push('/dashboard/comments');
    },
    onError: (err) => {
      toast.error('Failed to update comment');
    },
  });

  const { register, handleSubmit, reset, formState } = useForm<CommentForm>({
    resolver: zodResolver(CommentSchema),
  });

  React.useEffect(() => {
    if (data) {
      reset({
        blogId: data.blogId,
        name: data.name,
        comment: data.comment,
      });
    }
  }, [data, reset]);

  const onSubmit = (formData: CommentForm) => {
    updateComment.mutate(formData);
  };

  if (isLoading) return <p>Loading comment...</p>;
  if (isError) return <p className="text-red-500">Failed to load comment</p>;

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Comments', href: '/dashboard/comments' },
    { label: 'Edit', href: `/dashboard/comments/${id}` },
  ];

  return (
    <div className="p-8 text-black">
      <h1 className="text-2xl font-bold mb-6">Edit Comment</h1>
      <Breadcrumb items={breadCrumb} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-gray-200 text-black hover:bg-gray-500 rounded"
            disabled={updateComment.isPending}
          >
            {updateComment.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className=" font-medium mb-2">Blog ID</label>
            <input
              {...register('blogId')}
              className="w-full p-3 border rounded text-black cursor-not-allowed"
              readOnly
            />
          </div>
          <div>
            <label className=" font-medium mb-2">Name</label>
            <input
              {...register('name')}
              className="w-full p-3 border rounded text-black"
            />
            {formState.errors.name && (
              <p className="text-red-500 text-sm">
                {formState.errors.name.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">Comment</label>
          <textarea
            {...register('comment')}
            rows={4}
            className="w-full p-3 border rounded text-black"
          />
          {formState.errors.comment && (
            <p className="text-red-500 text-sm">
              {formState.errors.comment.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
