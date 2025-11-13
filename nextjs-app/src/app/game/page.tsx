import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import GameBoard from "./GameBoard";

export default async function GamePage() {
    const supabase = await createClient(cookies());

    const { data: weeks, error } = await supabase 
        .from('questions')
        .select('week')
        .order('week', { ascending: false }) as { data: { week: number }[] | null, error: any }

    if (error) {
        return <div className="p-8 text-red-500">Failed to load game data.</div>;
    }
    const uniqueWeeks = Array.from(new Set(weeks?.map((w) => w.week))); 

    return (
        <main className="p-8 space-y-6">
            <GameBoard availableWeeks={uniqueWeeks} />
        </main>
    )
}