'use client';

import {useState, useEffect} from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function HomePage() {
    const [isModalOpen, setModalOpen] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();
    
    useEffect(() => {
        // Get initial session
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
        
        // Listen for auth changes (login, logout, token refresh, session expiry)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        
        // Cleanup subscription on unmount
        return () => subscription.unsubscribe();
    }, []);
    
    return (
        <>
            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl max-w-md mx-4 border border-yellow-500/30 flex flex-col items-center">
                        <img
                            src="/favicon.ico"
                            alt="Weekly Blitz Trivia Logo"
                            className="w-24 h-24 object-cover mx-auto mb-4 drop-shadow-lg rounded-full border-4 border-yellow-400"
                        />
                        <h2 className="text-xl font-extrabold text-yellow-400 mb-4 drop-shadow-lg tracking-wide text-center">
                            🏈 Weekly Blitz Trivia 🏈
                        </h2>
                        <p className="text-gray-300 mb-6 leading-relaxed text-center">
                            It's time to test your NFL knowledge from week to week.
                            Do you know ball? Let's find out!
                        </p>
                        <button
                            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl shadow-md transition-transform transform hover:scale-105"
                            onClick={() => setModalOpen(false)}
                        >
                            Let's Go!
                        </button>
                    </div>
                </div>
            )}

            <main className="relative text-center min-h-screen flex flex-col items-center justify-between py-8">
            {/* Content shown after modal is closed */}
            {!isModalOpen && (
            <>
            <div className="flex-grow flex items-center justify-center">
            <ol className="space-y-6 w-64">
                <li>
                    <Link 
                        href="/game" 
                        className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-15 text-2xl rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    >
                        Play
                    </Link>
                </li>
                <li>
                    <Link 
                        href="/leaderboard"
                        className="block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-15 text-2xl rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    >
                        Leaderboard
                    </Link>
                </li>
                <li>
                    <Link 
                        prefetch={true} 
                        href="/about"
                        className="block bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-15 text-2xl rounded-lg transition-transform transform hover:scale-105"
                    >
                        About
                    </Link>
                </li>
            </ol>
            </div>

            <footer className="flex flex-col items-center space-y-3">
                {user ? (
                    <>
                        <p className="text-xl text-yellow-400 font-semibold">
                            Welcome, {user.user_metadata?.username || user.email}! 👋
                        </p>
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                setUser(null);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                        >
                            🚪 Logout
                        </button>
                    </>
                ) : (
                    <Link 
                        href="/auth"
                        className="block bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    >
                        🔐 Sign In / Sign Up
                    </Link>
                )}
                <p className="text-sm text-gray-300">
                    © {new Date().getFullYear()} Weekly Blitz Trivia
                </p>
            </footer>
            </>
            )}
        </main>
        </>
    );
}
