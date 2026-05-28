import StadiumMap from "@/components/StadiumMap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-canvas-white)] text-[var(--color-midnight-ink)] selection:bg-[var(--color-cloud-cover)] selection:text-[var(--color-midnight-ink)]">
      <Navbar />
      
      <div className="relative pt-40 pb-16 flex flex-col items-center justify-center overflow-hidden">
        
        <div className="z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block mb-10 px-4 py-1 border border-[var(--color-steel-gaze)] rounded-[3.4px]">
            <span className="text-[var(--color-midnight-ink)] text-[10px] uppercase tracking-widest font-bold">Interactive Exhibition</span>
          </div>
          <h1 className="text-[50px] md:text-[72px] font-[family-name:var(--font-letterform)] leading-[1.0] mb-8">
            The Gallery Collection.
          </h1>
          <p className="text-[17px] leading-[1.41] text-[var(--color-carbon-text)] font-light max-w-2xl mx-auto mb-10">
            A brutalist, isometric study of high-concurrency event ticketing. Select a piece from the grid below to reserve your space in real-time.
          </p>
        </div>
      </div>
      
      <main className="w-full mx-auto flex flex-col items-center relative z-10">
        <div className="flex flex-wrap justify-center gap-[48px] mb-8 px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[var(--color-cloud-cover)] border border-[var(--color-midnight-ink)] rounded-sm"></div> 
            <span className="text-[14px] text-[var(--color-fog)]">Available</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[var(--color-fog)] border border-[var(--color-midnight-ink)] rounded-sm"></div> 
            <span className="text-[14px] text-[var(--color-fog)]">Locked</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[var(--color-midnight-ink)] rounded-sm"></div> 
            <span className="text-[14px] text-[var(--color-fog)]">Booked</span>
          </div>
        </div>
        
        <div className="w-full overflow-hidden">
          <StadiumMap />
        </div>
      </main>

      <Footer />
    </div>
  );
}
