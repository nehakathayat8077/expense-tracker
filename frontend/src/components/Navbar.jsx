import React from 'react'
import { useAuth } from "../context/AuthContext"
const Navbar = () => {
  const { user, logout } = useAuth()
   const handleLogout = () => {
    logout()
    navigate("/")
  }
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
            onClick={()=>{handleLogout}}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
