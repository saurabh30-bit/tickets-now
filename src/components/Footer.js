export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 mt-24 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <span className="text-xl font-black text-white tracking-tighter">Tickets<span className="text-orange-500">Now</span></span>
          <p className="text-gray-500 text-sm mt-2">© 2026 GenZ Institute. All rights reserved.</p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms</a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy</a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
