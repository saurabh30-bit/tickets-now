export default function SeatModal({ seatId, onCheckout, onCancel }) {
  if (!seatId) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-xl">
      <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-gray-800 p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-sm w-full transform transition-all">
        <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
        </div>
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Seat Reserved</h2>
        <p className="text-gray-400 mb-8 text-sm">You have temporarily locked <span className="text-white font-bold">Seat #{seatId}</span>. Complete checkout within 5:00 to secure it.</p>
        
        <div className="flex justify-between items-center bg-black/50 p-5 rounded-2xl mb-8 border border-gray-800/50 shadow-inner">
          <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Total Price</span>
          <span className="text-3xl font-black text-white">$99<span className="text-gray-600 text-lg">.00</span></span>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 py-4 px-4 rounded-xl font-bold text-gray-400 bg-transparent border border-gray-800 hover:bg-gray-900 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onCheckout}
            className="flex-1 py-4 px-4 rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-500 transition-all shadow-[0_0_20px_rgba(255,115,0,0.4)] hover:shadow-[0_0_30px_rgba(255,115,0,0.6)]"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
