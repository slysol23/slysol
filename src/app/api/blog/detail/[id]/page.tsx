import { notFound } from 'next/navigation';

interface BlogItem {
  id: number;
  title: string;
  description: string;
  content: string;
  image: string;
  author: string;
  createdAt: string;
}

async function getBlog(id: string): Promise<BlogItem | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}`,
    {
      cache: 'no-store',
    },
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function BlogDetails({
  params,
}: {
  params: { id: string };
}) {
  const blog = await getBlog(params.id);
  if (!blog) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-[400px] object-cover rounded-xl mb-8"
      />
      <h1 className="text-4xl font-bold mb-3">{blog.title}</h1>
      <p className="text-gray-400 mb-6">
        By <span className="font-semibold">{blog.author}</span> ·{' '}
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}
