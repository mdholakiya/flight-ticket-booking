'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
// import LoginPage from '../login/page';
import { userService } from '@/services/userService';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate for spaces
    if (email.includes(' ') || password.includes(' ')) {
      toast.error('Email and password cannot contain spaces');
      return;
    }

    // Validate empty fields
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('All fields are required');
      return;
    }

    try {
      await userService.register({ name, email: email.trim(), password: password.trim() });
      toast.success('Registration successful! Please login to continue.');
      
      // Get the saved booking path
      const redirectPath = localStorage.getItem('redirectAfterAuth');
      
      // Redirect to login with the return URL
      if (redirectPath) {
        router.push(`/login?returnTo=${encodeURIComponent(redirectPath)}`);
      } else {
        router.push('/login');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'name' | 'email' | 'password') => {
    const value = e.target.value;
    
    // Allow spaces only in name field
    if (field === 'name') {
      setName(value);
    } else if (field === 'email') {
      // Remove spaces from email
      setEmail(value.replace(/\s/g, ''));
    } else if (field === 'password') {
      // Remove spaces from password
      setPassword(value.replace(/\s/g, ''));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-sky-950 via-sky-900 to-sky-800">
      <div className="max-w-md w-full space-y-8 p-8 rounded-xl shadow-2xl border border-sky-400/20 bg-sky-950/40 backdrop-blur-sm">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-white to-sky-300 bg-clip-text text-transparent">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-sky-400/30 placeholder-sky-300/60 text-white bg-sky-900/40 rounded-t-md focus:outline-none focus:ring-sky-400 focus:border-sky-400 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={name}
                onChange={(e) => handleInputChange(e, 'name')}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-sky-400/30 placeholder-sky-300/60 text-white bg-sky-900/40 focus:outline-none focus:ring-sky-400 focus:border-sky-400 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => handleInputChange(e, 'email')}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-sky-400/30 placeholder-sky-300/60 text-white bg-sky-900/40 rounded-b-md focus:outline-none focus:ring-sky-400 focus:border-sky-400 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => handleInputChange(e, 'password')}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 transition-colors duration-200"
            >
              Register
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-sky-300/80">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-sky-400 hover:text-sky-300 transition-colors duration-200">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 