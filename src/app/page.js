import StadiumMap from "@/components/StadiumMap";

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-white">TicketsNow</h1>
        <p className="text-xl text-gray-400">High-Concurrency Ticketing Platform</p>
      </header>
      
      <main className="w-full max-w-7xl flex flex-col items-center">
        <div className="flex gap-4 mb-8">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded-sm"></div> Available</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-500 rounded-sm"></div> Reserved (5m TTL)</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded-sm"></div> Sold</div>
        </div>
        
        <div className="w-full overflow-x-auto p-4 bg-black/50 border border-gray-800 rounded-xl shadow-2xl">
          <StadiumMap />
        </div>
      </main>
    </div>
  );
}
