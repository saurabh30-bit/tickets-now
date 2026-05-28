export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-40 bg-black/50 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-black text-white tracking-tighter">Tickets<span className="text-orange-500">Now</span></span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Events</a>
              <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Pricing</a>
              <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">About Us</a>
            </div>
          </div>
          <div>
            <button className="bg-transparent border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 font-bold py-2 px-4 rounded-lg mr-2 transition-colors">
              Log In
            </button>
            <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-[0_0_10px_rgba(255,115,0,0.3)]">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
