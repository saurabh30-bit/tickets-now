import StadiumMap from "@/components/StadiumMap";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="w-screen h-screen bg-[var(--color-canvas-white)] text-[var(--color-midnight-ink)] selection:bg-[var(--color-cloud-cover)] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      
      {/* Full screen WebGL Canvas container */}
      <div className="absolute inset-0 z-0">
        <StadiumMap />
      </div>
      
    </div>
  );
}
