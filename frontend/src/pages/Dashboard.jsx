import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"

function Dashboard() {
  const { user, logout } = useAuth()

  const [transactions, setTransactions] = useState([])

  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState("expense")
  const [category, setCategory] = useState("general")

  // =========================
  // FETCH TRANSACTIONS
  // =========================
  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/transactions",
        { withCredentials: true }
      )
      setTransactions(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  // =========================
  // ADD TRANSACTION
  // =========================
  const addTransaction = async (e) => {
    e.preventDefault()

    if (!title || !amount) return

    try {
      const res = await axios.post(
        "http://localhost:3000/api/transactions",
        {
          title,
          amount: Number(amount),
          type,
          category,
        },
        { withCredentials: true }
      )

      setTransactions([res.data, ...transactions])

      setTitle("")
      setAmount("")
    } catch (err) {
      console.log(err)
    }
  }

  // =========================
  // DELETE TRANSACTION
  // =========================
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/transaction/${id}`,
        { withCredentials: true }
      )

      setTransactions(
        transactions.filter((t) => t._id !== id)
      )
    } catch (err) {
      console.log(err)
    }
  }

  // =========================
  // BALANCE CALCULATION
  // =========================
  const balance = transactions.reduce((acc, t) => {
    if (t.type === "income") return acc + t.amount
    else return acc - t.amount
  }, 0)

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0)

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0)

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* NAVBAR */}
      <Navbar/>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded">
          <p>Balance</p>
          <h2 className="text-2xl font-bold">₹{balance}</h2>
        </div>

        <div className="bg-green-800 p-4 rounded">
          <p>Income</p>
          <h2 className="text-2xl font-bold">₹{income}</h2>
        </div>

        <div className="bg-red-800 p-4 rounded">
          <p>Expense</p>
          <h2 className="text-2xl font-bold">₹{expense}</h2>
        </div>
      </div>

      {/* ADD TRANSACTION */}
      <form
        onSubmit={addTransaction}
        className="bg-gray-800 p-4 rounded mb-6 flex gap-3"
      >
        <input
          className="bg-gray-700 p-2 rounded w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          className="bg-gray-700 p-2 rounded w-full"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          className="bg-gray-700 p-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          className="bg-gray-700 p-2 rounded"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button 
        type="submit"
        className="bg-blue-600 px-4 rounded hover:cursor-pointer hover:bg-blue-500 ">
          Add
        </button>
      </form>

      {/* TRANSACTIONS LIST */}
      <div className="bg-gray-800 p-4 rounded">
        <h2 className="text-xl mb-4">Transactions</h2>

        {transactions.length === 0 && (
          <p className="text-gray-400">No transactions</p>
        )}

        {transactions.map((t) => (
          <div
            key={t._id}
            className="flex justify-between items-center bg-gray-700 p-3 rounded mb-2"
          >
            <div>
              <p className="font-bold">{t.title}</p>
              <p className="text-sm text-gray-400">
                {t.category}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={
                  t.type === "income"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                ₹{t.amount}
              </span>

              <button
                onClick={() => deleteTransaction(t._id)}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard