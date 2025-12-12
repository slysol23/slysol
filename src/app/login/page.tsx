'use client';

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success || response.ok) {
        window.location.href = '/dashboard/blog';
      } else {
        setError(data.error || 'Login failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === 'password') {
      const pwd = e.target.value;
      if (pwd.length < 6) setPasswordStrength('Weak');
      else if (pwd.length < 10) setPasswordStrength('Medium');
      else setPasswordStrength('Strong');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-[#CBFCD8] via-[#B9E6E6] to-[#96BCFD] animate-gradient">
      {/* Floating particles */}{' '}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute bg-white/30 rounded-full animate-float"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 6 + 4}s`,
            }}
          />
        ))}{' '}
      </div>
      <div className="relative z-10 backdrop-blur-xl bg-white/30 border border-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-md animate-fadeInSlow">
        <Link href="/">
          <div className="flex justify-center">
            <Image
              src={'/icons/slysol.svg'}
              alt="Next"
              width={80}
              height={50}
            />
          </div>
        </Link>
        <p className="text-center font-bold text-gray-600 mb-6">
          Sign in to continue
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/60 border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-indigo-400 outline-none transition"
              placeholder="Email Address"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/60 border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-indigo-400 outline-none transition"
              placeholder="Password"
            />

            {/* Toggle password visibility button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5"
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="loader"></span>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
      <style jsx>{`
        .animate-gradient {
          animation: gradientShift 10s ease infinite;
          background-size: 200% 200%;
        }
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-fadeInSlow {
          animation: fadeIn 1.2s ease forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes shake {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          50% {
            transform: translateX(4px);
          }
          75% {
            transform: translateX(-4px);
          }
          100% {
            transform: translateX(0);
          }
        }

        .loader {
          width: 14px;
          height: 14px;
          border: 3px solid rgba(255, 255, 255, 0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-float {
          animation: float 6s linear infinite;
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
            opacity: 1;
          }
          50% {
            transform: translateY(-20px);
            opacity: 0.5;
          }
          100% {
            transform: translateY(0px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
