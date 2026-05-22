import React from 'react'
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      )
    } catch (err) {
      console.log(err)
    }
    logout()
    navigate("/")
  }

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <h1 className="text-xl font-bold text-white">
            Expense <span className="text-blue-400">Tracker</span>
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          
          {/* User Badge */}
          <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="text-gray-300 text-sm">
              Hi, <span className="text-white font-semibold">{user?.name || "User"}</span>
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer transition-all duration-300 text-sm font-semibold flex items-center gap-2"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar