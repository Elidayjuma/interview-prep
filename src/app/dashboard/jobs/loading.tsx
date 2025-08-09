export default function Loading() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <div className="animate-pulse space-y-4">
                <div className="h-8 w-56 bg-gray-200 rounded" />
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded" />
                ))}
            </div>
        </div>
    );
}
