'use client'

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '@supabase/supabase-js';
import { sub } from 'framer-motion/client';

type Question = {
    id: number;
    week: number;
    question: string;
    difficulty: string;
    correct_answers: string[];
}

export default function GameBoard({ availableWeeks }: { availableWeeks: number[] }) {
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [gameSessionId, setGameSessionId] = useState(0);
    
    useEffect(() => {
        // Get initial session
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        
        return () => subscription.unsubscribe();
    }, []);
    
    const loadQuestions = async () => {
        if (selectedWeek === null) return;
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .eq('week', selectedWeek)
            .order('id', { ascending: true})
        setLoading(false);

        if (error) setError('Failed to load questions.');
        else if (data) setQuestions(data || []); 
    }

    if (questions.length > 0) {
        return (
            <TriviaGame 
                key={`game-${selectedWeek}-session-${gameSessionId}`} // Forces remount when key changes
                questions={questions} 
                week={selectedWeek!}
                user={user}
                onBackToWeekSelection={() => {
                    setQuestions([]);
                    setSelectedWeek(null);
                }}
                onRestartSameWeek={() => {
                    setGameSessionId(prev => prev + 1);
                }}
            />
        );
    }

    return (
        <div className="max-w-xl mx-auto bg-gray-300/60 text-white rounded-2xl p-5 space-y-4">
            <h2 className="text-2xl font-semibold">Week Selection 🗓️</h2>
            <select 
                className="cursor-pointer hover:bg-gray-500/60 w-full p-3 text-white text-lg rounded [&>option]:cursor-pointer"
                value={selectedWeek ?? ''}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
            >
                <option value="">-- Choose Week --</option>
                {availableWeeks.map((week) => (
                    <option key={week} value={week}>Week {week}</option>
                ))}
            </select>
            <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-100"
                onClick={loadQuestions}
                disabled={!selectedWeek || loading}
            >
                {loading ? 'Loading...' : 'Start Trivia'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    )
}

function TriviaGame({ questions, week, user, onBackToWeekSelection, onRestartSameWeek }: { 
    questions: Question[]; 
    week: number;
    user: User | null;
    onBackToWeekSelection: () => void;
    onRestartSameWeek: () => void;
}) {
    const supabase = createClient();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [timeLeft, setTimeLeft] = useState(20); // 20 seconds per question

    const currentQuestion = questions[currentIndex];

    // Timer effect - counts down every second
    useEffect(() => {
        if (timeLeft <= 0) {
            // Time's up - auto-submit
            checkAnswer();
            nextQuestion();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, currentIndex]);

    // Reset timer when question changes
    useEffect(() => {
        setTimeLeft(20);
    }, [currentIndex]);

    const checkAnswer = () => {
        const trimmed = userAnswer.trim();
        if (!trimmed) {
            nextQuestion();
            return;
        }
        const correct = currentQuestion.correct_answers.some(answer => 
            answer.toLowerCase() === userAnswer.trim().toLowerCase());
        setIsCorrect(correct);
        
        // Use functional update to get the latest score value
        if (correct) {
            if (currentQuestion.difficulty === 'easy') {
                setScore(prevScore => prevScore + 2);
            } else if (currentQuestion.difficulty === 'medium') {
                setScore(prevScore => prevScore + 6);
            } else if (currentQuestion.difficulty === 'hard') {
                setScore(prevScore => prevScore + 15);
            }
        }
    }

    const nextQuestion = () => {
        setUserAnswer('');
        setIsCorrect(false);
        setCurrentIndex(currentIndex + 1);
    }

    async function submitScore(userId: string, week: number, newScore: number) {
        const { error } = await supabase.rpc('update_weekly_score', {
            p_user_id: userId,
            p_week: week,
            p_new_score: newScore,
        })
        if (error) {
            // Silently fail - could add user-facing error handling here
        }
    }


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkAnswer();
                nextQuestion();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [currentIndex, userAnswer]);

    // Only show completion screen if we've actually finished (not resetting)
    const isGameComplete = currentIndex >= questions.length && currentIndex > 0;

    // Submit score when game completes
    useEffect(() => {
        if (isGameComplete && user?.id) {
            submitScore(user.id, week, score);
        }
    }, [isGameComplete, user?.id, week, score]);

    if (isGameComplete) {
        return (
            <div className="max-w-xl mx-auto bg-gray-900 text-white rounded-2xl p-6 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-2">🏈 Quiz Complete!</h2>
                    <p className="text-gray-400">Week {week} Trivia</p>
                </div>

                {/* Score Display */}
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-400 mb-2">Your Final Score</p>
                    <p className="text-5xl font-bold text-green-400">{score} points</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {/* Play Again - Same Week */}
                    <button
                        onClick={onRestartSameWeek}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        🔄 Play Week {week} Again
                    </button>

                    {/* Play Different Week */}
                    <button
                        onClick={onBackToWeekSelection}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        📅 Choose Different Week
                    </button>

                    {/* View Leaderboard */}
                    <Link
                        href="/leaderboard"
                        className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center"
                    >
                        🏆 View Leaderboard
                    </Link>

                    {/* About */}
                    <Link
                        href="/about"
                        className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                    >
                        📖 About
                    </Link>

                    {/* Login/Signup Link - Only show if not logged in */}
                    {!user && (
                        <Link
                            href="/auth"
                            className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                        >
                            🔐 Login / Sign Up
                        </Link>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className='w-full max-w-2xl mx-auto p-8 relative'>
            <div className="flex justify-between items-center mb-4">
                <p className='text-base text-gray-400'>
                    Week {week} - Question {currentIndex + 1} of {questions.length}
                </p>
                <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${
                    timeLeft <= 5 ? 'bg-red-600 text-white animate-pulse' : 
                    timeLeft <= 10 ? 'bg-yellow-600 text-white' : 
                    'bg-green-600 text-white'
                }`}>
                    ⏱️ {timeLeft}s
                </div>
            </div>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}     
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-300/60 border border-yellow-500/30 rounded-2xl p-8 shadow-lg"
                >
                    {/* Difficulty Badge */}
                    <div className="flex justify-center mb-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                            currentQuestion.difficulty === 'easy' ? 'bg-green-500 text-white' :
                            currentQuestion.difficulty === 'medium' ? 'bg-yellow-500 text-black' :
                            'bg-red-500 text-white'
                        }`}>
                            {currentQuestion.difficulty === 'easy' ? '⭐ EASY (2 pts)' :
                             currentQuestion.difficulty === 'medium' ? '⭐⭐ MEDIUM (6 pts)' :
                             '⭐⭐⭐ HARD (15 pts)'}
                        </span>
                    </div>
                    
                    <h2 className="text-2xl font-semibold mb-6 text-center">
                        {currentQuestion.question}
                    </h2>
                    <div className="flex justify-center">
                        <input
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className="w-4/5 p-2 text-2xl text-black rounded text-center"
                            placeholder=""
                            autoFocus
                        />
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => {checkAnswer(); nextQuestion();}}
                            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-lg rounded-lg transition transform active:scale-95"
                        >
                            Submit
                        </button>
                    </div>
                </motion.div>     
            </AnimatePresence>
        </div>
    )
}
