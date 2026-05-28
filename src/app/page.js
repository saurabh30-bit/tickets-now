import StadiumMap from "@/components/StadiumMap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30">
      <Navbar />
      
      <div className="relative pt-32 pb-12 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 backdrop-blur-sm">
            <span className="text-orange-400 font-semibold text-sm tracking-wide">🔥 LIVE: 5,000 TICKETS AVAILABLE NOW</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 drop-shadow-2xl">
            Secure Your Seat.
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            The world's most advanced high-concurrency ticketing engine. Choose your section below and checkout in milliseconds.
          </p>
        </div>
      </div>
      
      <main className="w-full max-w-[1400px] mx-auto px-4 flex flex-col items-center pb-24 relative z-10">
        <div className="flex flex-wrap justify-center gap-6 mb-12 bg-black/40 backdrop-blur-md border border-gray-800 px-8 py-4 rounded-full shadow-2xl">
          <div className="flex items-center gap-3"><div className="w-4 h-4 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div> <span className="text-sm font-bold tracking-wider text-gray-300 uppercase">Available</span></div>
          <div className="flex items-center gap-3"><div className="w-4 h-4 bg-yellow-500 rounded-full shadow-[0_0_10px_#eab308]"></div> <span className="text-sm font-bold tracking-wider text-gray-300 uppercase">Locked</span></div>
          <div className="flex items-center gap-3"><div className="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]"></div> <span className="text-sm font-bold tracking-wider text-gray-300 uppercase">Booked</span></div>
        </div>
        
        <div className="w-full">
          <StadiumMap />
        </div>
      </main>

      <Footer />
    </div>
  );
}
