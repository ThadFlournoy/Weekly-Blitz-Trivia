import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="max-w-3xl w-full bg-gray-900/90 text-white rounded-2xl p-8 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-yellow-400 mb-2">🏈 About Weekly Blitz Trivia</h1>
                </div>

                {/* Content */}
                <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                    <p>
                        Hello there! Weekly Blitz Trivia is a fun, fast-paced trivia game dedicated to your casual football fan, NFL Fanatic, and everything in between! 
                    </p>
                    
                    <p>
                        Each week, new questions are added to keep the game fresh and exciting. 
                        Compete with others to see how much you really know!
                    </p>

                    <p>
                        Test your knowledge across easy, medium, and hard questions.
                        Earn points for correct answers and climb the leaderboard to prove you're the ultimate NFL trivia champion!
                    </p>

                    <div className="pt-4">
                        <h2 className="text-2xl font-bold text-yellow-400 mb-3">How to Play:</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            <li>Select a week from the game page</li>
                            <li>Answer trivia questions about that week's NFL action</li>
                            <li>Earn points based on difficulty of questions: Easy (2 pts), Medium (6 pts), Hard (15 pts)</li>
                            <li>Check the leaderboard to see how you stack up!</li>
                        </ul>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-8 text-center">
                    <Link 
                        href="/"
                        className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}