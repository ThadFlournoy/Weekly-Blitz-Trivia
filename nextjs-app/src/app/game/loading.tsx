export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="text-center">
                <div className="text-6xl mb-4 animate-spin">🏈</div>
                <p className="text-yellow-400 text-xl font-bold">Loading...</p>
            </div>
        </div>
    );
}