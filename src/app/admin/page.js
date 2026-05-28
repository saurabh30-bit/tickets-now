import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#020202] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center border-b border-gray-800 pb-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
              Command Center
            </h1>
            <p className="text-gray-500 font-mono text-sm mt-2">SYSTEM STATUS: <span className="text-green-500">ONLINE</span> | STAMPEDE PROTECTION: <span className="text-green-500">ACTIVE</span></p>
          </div>
          <Link href="/">
            <button className="bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg text-sm">
              &larr; Back to Stadium
            </button>
          </Link>
        </header>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">Total Revenue</h3>
            <p className="text-4xl font-black text-white">$45,299<span className="text-gray-600 text-xl">.00</span></p>
          </div>
          <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">Seats Sold</h3>
            <p className="text-4xl font-black text-white">412 <span className="text-gray-600 text-lg font-normal">/ 5,000</span></p>
            <div className="w-full bg-gray-900 h-1.5 mt-4 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full w-[8%]"></div>
            </div>
          </div>
          <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">Reserved (Pending)</h3>
            <p className="text-4xl font-black text-white">1,204</p>
            <p className="text-gray-500 text-xs mt-2">Expiring in &lt; 5 mins</p>
          </div>
          <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">Available Seats</h3>
            <p className="text-4xl font-black text-white">3,384</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LIVE ACTIVITY FEED */}
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-white font-bold mb-6 flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> Live Transactions
            </h3>
            <div className="space-y-4 font-mono text-sm">
              {[
                { time: "12:00:04.123", action: "PURCHASE", seat: "VIP-402", status: "SUCCESS" },
                { time: "12:00:04.091", action: "PURCHASE", seat: "LEFT-190", status: "SUCCESS" },
                { time: "12:00:03.855", action: "RESERVE", seat: "GEN-1402", status: "LOCKED" },
                { time: "12:00:03.412", action: "PURCHASE", seat: "VIP-402", status: "CONFLICT (REJECTED)" },
                { time: "12:00:02.999", action: "TIMEOUT", seat: "RIGHT-55", status: "RELEASED" },
              ].map((log, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-gray-800/50 last:border-0">
                  <span className="text-gray-500">{log.time}</span>
                  <span className="text-gray-300 w-24">{log.action}</span>
                  <span className="text-orange-400 w-24">{log.seat}</span>
                  <span className={`w-36 text-right ${log.status.includes('REJECTED') ? 'text-red-500' : log.status === 'RELEASED' ? 'text-yellow-500' : 'text-green-500'}`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* DANGER ZONE */}
          <div className="bg-[#0a0a0a] border border-red-900/30 rounded-2xl p-6 shadow-2xl flex flex-col">
            <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2">
              ⚠️ Danger Zone
            </h3>
            <p className="text-gray-500 text-sm mb-6 flex-grow">
              These actions directly affect the production database. Use with extreme caution during a live event.
            </p>
            
            <div className="space-y-4">
              <button className="w-full bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 text-red-500 font-bold py-4 rounded-xl transition-all text-sm">
                FORCE RELEASE ALL RESERVATIONS
              </button>
              <button className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] text-sm tracking-widest">
                RESET STADIUM TO EMPTY
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
