'use client'

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const supabase = createClient();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async () => {
        setError(null);
        if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { 
                        username: username,
                        display_name: username
                    }
                }
            });
            if (error) {
                setError('Please Enter Valid Credentials');
            } else {
                router.push('/');
            }
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) {
                setError('Please Enter Valid Credentials');
            } else {
                router.push('/');
            }
        }
    }
    
    useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAuth();
                }
            }
            window.addEventListener('keydown', handleKeyDown);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            }
        }, [email, password, username, isSignUp]);

    return (
        <div className="flex min-h-screen items-center justify-center text-white">
            <div className="bg-gray-900/80 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4">
                <h2 className="text-2xl font-bold text-center mb-4">
                    {isSignUp ? 'Sign Up' : 'Log In'}
                </h2>
                {isSignUp && (
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-500"
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-500"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    onClick={handleAuth}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
                >
                    {isSignUp ? 'Sign Up' : 'Log In'}
                </button>
                <p className="text-center text-sm text-gray-400">
                    {isSignUp ? 'Already have an account? ' : 'Need an account? '}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-yellow-400 font-semibold hover:underline"
                    >
                        {isSignUp ? 'Log In' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
}