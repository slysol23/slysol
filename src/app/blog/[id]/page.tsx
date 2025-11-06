'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { blog } from 'lib/blog';
import { IBlog } from 'lib/type';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Title from '@/components/Title';
import MainHeading from '@/components/MainHeading';

export default function BlogDetailsPage() {
  const params = useParams();
  const id = Number(params.id);

  const [b, setB] = useState<IBlog>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await blog.getById(id);
        if (res?.data) {
          setB(res.data);
        } else {
          setError('Blog not found');
        }
      } catch (err) {
        console.error(err);
        setError('Error loading blog. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(id)) fetchBlog();
    else setError('Invalid blog ID');
  }, [id]);

  if (loading)
    return <div className="text-center text-black py-20">Loading blog...</div>;

  if (error)
    return <div className="text-center text-red-500 py-20">{error}</div>;

  return (
    <div>
      <Container hScreen={false}>
        <Header />
        <div className="pt-10 pb-20">
          {b?.image && (
            <img
              src={b.image.startsWith('http') ? b.image : `/uploads/${b.image}`}
              alt={b.title}
              className="w-full h-96 object-cover rounded-3xl my-6"
            />
          )}
          <MainHeading text={b?.title ?? 'Untitiled'} className="font-bold" />
          {b ? (
            <p className="text-sm text-gray-400 mb-2 mt-2">
              Published by{' '}
              {b.author
                ? `${b.author.firstName} ${b.author.lastName}`
                : `Author #${b.authorId}`}{' '}
              on{' '}
              {b.createdAt
                ? new Date(b.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Unknown date'}
            </p>
          ) : (
            <p className="text-sm text-gray-400 mb-2">
              Blog information not available
            </p>
          )}

          {/* <p className="text-gray-400 text-sm mt-5 mb-5">
            Published on{' '}
            {new Date(b?.createdAt || '').toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p> */}

          <div className="text-black leading-relaxed whitespace-pre-line">
            {b?.content}
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}
