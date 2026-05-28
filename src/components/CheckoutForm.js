import { useState } from 'react';

export default function CheckoutForm({ seatId, onSuccess, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayNow = () => {
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); onSuccess(seatId); }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-2xl">
      <div className="bg-[#0a0a0a]/90 backdrop-blur-3xl border border-gray-800 p-10 rounded-3xl shadow-[0_0_80px_rgba(255,115,0,0.15)] max-w-md w-full relative">
        <button 
          onClick={onCancel} 
          className="absolute top-6 right-6 text-gray-600 hover:text-white transition-colors bg-gray-900 w-8 h-8 rounded-full flex items-center justify-center"
        >
          ✕
        </button>

        <h2 className="text-2xl font-black text-white mb-8 tracking-tight">Secure Checkout</h2>
        
        <div className="space-y-5 mb-10">
          <div>
            <label className="block text-xs font-bold text-gray-500 tracking-widest uppercase mb-2">Cardholder Name</label>
            <input type="text" placeholder="ALEXANDER DOE" className="w-full bg-black/50 border border-gray-800 text-white p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-colors shadow-inner" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 tracking-widest uppercase mb-2">Card Number</label>
            <div className="relative">
              <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-black/50 border border-gray-800 text-white p-4 pl-12 rounded-xl focus:outline-none focus:border-orange-500 transition-colors shadow-inner font-mono" />
              <svg className="w-6 h-6 absolute left-4 top-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 tracking-widest uppercase mb-2">Expiry</label>
              <input type="text" placeholder="MM/YY" className="w-full bg-black/50 border border-gray-800 text-white p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-colors shadow-inner font-mono text-center" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 tracking-widest uppercase mb-2">CVC</label>
              <input type="text" placeholder="•••" className="w-full bg-black/50 border border-gray-800 text-white p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-colors shadow-inner font-mono text-center" />
            </div>
          </div>
        </div>

        <button 
          onClick={handlePayNow}
          disabled={isLoading}
          className="w-full py-5 rounded-xl font-black text-white bg-orange-600 hover:bg-orange-500 transition-all shadow-[0_0_20px_rgba(255,115,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-16 tracking-widest"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "PAY $99.00 NOW"
          )}
        </button>
      </div>
    </div>
  );
}
