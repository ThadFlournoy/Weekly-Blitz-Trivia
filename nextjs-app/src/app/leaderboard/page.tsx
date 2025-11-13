'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

type LeaderboardEntry = {
  score: number
  week: number
  profiles: {
    username: string
  } | null
}

export default function LeaderboardPage() {
  const supabase = createClient()
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [availableWeeks, setAvailableWeeks] = useState<number[]>([])

  useEffect(() => {
    // Get available weeks
    const fetchWeeks = async () => {
      const { data } = await supabase
        .from('questions')
        .select('week')
        .order('week', { ascending: false })
      
      if (data) {
        const uniqueWeeks = [...new Set(data.map(q => q.week))];
        setAvailableWeeks(uniqueWeeks);
        if (uniqueWeeks.length > 0) {
          setSelectedWeek(uniqueWeeks[0]); // Default to most recent week
        }
      }
    }
    fetchWeeks()
  }, [])

  useEffect(() => {
    if (selectedWeek === null) return;
    
    const fetchLeaderboard = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('weekly_scores')
        .select(`
            score,
            week,
            profiles (username)
        `)
        .eq('week', selectedWeek)
        .order('score', { ascending: false })
        .limit(10)

      if (!error) {
        setLeaderboard(data || [])
      }
      setLoading(false)
    }

    fetchLeaderboard()
  }, [selectedWeek])

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-gray-900/90 text-white rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">🏆 Leaderboard 🏆</h1>
          <p className="text-gray-400">Top 10 Players</p>
        </div>

        {/* Week Selector */}
        <div className="mb-6 flex justify-center">
          <select 
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white cursor-pointer"
            value={selectedWeek ?? ''}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
          >
            {availableWeeks.map((week) => (
              <option key={week} value={week}>Week {week}</option>
            ))}
          </select>
        </div>

        {/* Leaderboard Table */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4 animate-spin inline-block">🏈</div>
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No scores yet for this week. Be the first!</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-yellow-400">Rank</th>
                  <th className="px-6 py-4 text-left text-yellow-400">Player</th>
                  <th className="px-6 py-4 text-right text-yellow-400">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {leaderboard.map((entry, index) => (
                  <tr 
                    key={`${entry.profiles?.username || 'anonymous'}-${index}`}
                    className={`${
                      index === 0 ? 'bg-yellow-900/20' : 
                      index === 1 ? 'bg-gray-700/20' : 
                      index === 2 ? 'bg-orange-900/20' : 
                      'bg-gray-800/20'
                    } hover:bg-gray-700/40 transition-colors`}
                  >
                    <td className="px-6 py-4 font-bold text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                    </td>
                    <td className="px-6 py-4">
                      {entry.profiles?.username || 'Anonymous'}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-400">
                      {entry.score} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
  )
}
