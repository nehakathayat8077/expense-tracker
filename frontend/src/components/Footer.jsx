const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-10 py-6">
      <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3">
        
        {/* Left */}
        <div className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          <span className="text-white font-semibold">Expense Tracker</span>
        </div>

        {/* Middle */}
        <p className="text-gray-500 text-sm">
          Track your income and expenses easily 😊
        </p>

        {/* Right */}
        <p className="text-gray-500 text-sm">
          Built with ❤️ by{" "}
          <span className="text-blue-400 font-semibold">Neha Kathayat</span>
        </p>

      </div>
    </footer>
  )
}

export default Footer