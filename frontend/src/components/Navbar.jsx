import React from 'react'
import { useAuth } from "../context/AuthContext"
const Navbar = () => {
  const { user, logout } = useAuth()
  return (

    <div>
       {/* NAVBAR */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Expense Tracker
        </h1>

        <div className="flex gap-4 items-center">
          <span>Hi, {user?.name || "User"}</span>

          <button
            onClick={logout}
            className="bg-red-600 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
