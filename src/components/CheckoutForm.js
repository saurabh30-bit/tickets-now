import { useState } from 'react';

export default function CheckoutForm({ seatId, onSuccess, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayNow = () => {
    setIsLoading(true);
    // Simulate a 2-second API request to Stripe
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(seatId);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md">
      <div className="bg-[#111] border border-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full relative">
        <button 
          onClick={onCancel} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Complete Payment</h2>
        
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cardholder Name</label>
            <input type="text" placeholder="John Doe" className="w-full bg-black border border-gray-800 text-white p-3 rounded-lg focus:outline-none focus:border-orange-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Card Number</label>
            <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-black border border-gray-800 text-white p-3 rounded-lg focus:outline-none focus:border-orange-500 transition-colors" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Expiry</label>
              <input type="text" placeholder="MM/YY" className="w-full bg-black border border-gray-800 text-white p-3 rounded-lg focus:outline-none focus:border-orange-500 transition-colors" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">CVC</label>
              <input type="text" placeholder="123" className="w-full bg-black border border-gray-800 text-white p-3 rounded-lg focus:outline-none focus:border-orange-500 transition-colors" />
            </div>
          </div>
        </div>

        <button 
          onClick={handlePayNow}
          disabled={isLoading}
          className="w-full py-4 rounded-lg font-bold text-white bg-orange-600 hover:bg-orange-500 transition-colors shadow-[0_0_15px_rgba(255,115,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-14"
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
