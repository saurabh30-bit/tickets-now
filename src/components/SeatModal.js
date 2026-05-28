export default function SeatModal({ seatId, onCheckout, onCancel }) {
  if (!seatId) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#111] border border-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full">
        <h2 className="text-3xl font-bold text-white mb-2">Seat Selected</h2>
        <p className="text-gray-400 mb-6">You have temporarily reserved <span className="text-orange-500 font-bold">Seat #{seatId}</span>.</p>
        
        <div className="flex justify-between items-center bg-black p-4 rounded-lg mb-8 border border-gray-800">
          <span className="text-gray-400">Total Price</span>
          <span className="text-2xl font-bold text-white">$99.00</span>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-lg font-bold text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onCheckout}
            className="flex-1 py-3 px-4 rounded-lg font-bold text-white bg-orange-600 hover:bg-orange-500 transition-colors shadow-[0_0_15px_rgba(255,115,0,0.5)]"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
