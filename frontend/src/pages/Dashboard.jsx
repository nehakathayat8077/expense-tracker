import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

function Dashboard() {
  const { user } = useAuth()

  const [transactions, setTransactions] = useState([])
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState("expense")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)

  // BASE URL
  const API_URL = "http://localhost:3000/api/transaction"

  // Fetch Transactions
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(API_URL, {
          withCredentials: true,
        })
        setTransactions(res.data.transaction || [])
        console.log(transactions)
      } catch (err) {
        console.log("Fetch Error:", err)
        setTransactions([])
      }
    }

  useEffect(() => {
    fetchTransactions()
  }, [])

  // Add Transaction
  const addTransaction = async (e) => {
    e.preventDefault()

    if (!title || !amount || !category) return

    setLoading(true)

    try {
      const res = await axios.post(
        API_URL,
        {
          title,
          amount: Number(amount),
          type,
          category,
        },
        {
          withCredentials: true,
        }
      )

      // Add new transaction at top
      setTransactions([res.data.transaction, ...transactions])

      // Clear form
      setTitle("")
      setAmount("")
      setCategory("")
      setType("expense")
    } catch (err) {
      console.log("Add Error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Delete Transaction
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
      })

      // Remove deleted transaction from UI
      setTransactions(
        transactions.filter((t) => t._id !== id)
      )
    } catch (err) {
      console.log("Delete Error:", err)
    }
  }

  // Calculations
  const balance = transactions.reduce((acc, t) => {
    return t.type === "income"
      ? acc + t.amount
      : acc - t.amount
  }, 0)

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0)

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0)

  const pieData = [
  { name: "Income", value: income },
  { name: "Expense", value: expense }
]

const COLORS = ["#4ade80", "#f87171"]

const categoryData = transactions.reduce((acc, t) => {
  const existing = acc.find((item) => item.name === t.category)
  if (existing) {
    existing.value += t.amount
  } else {
    acc.push({ name: t.category, value: t.amount })
  }
  return acc
}, [])
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          <div className="bg-gray-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">
              Total Balance
            </p>

            <h2
              className={`text-3xl font-bold mt-2 ${
                balance >= 0
                  ? "text-white"
                  : "text-red-400"
              }`}
            >
              ₹{balance}
            </h2>
          </div>

          <div className="bg-green-900 rounded-2xl p-6">
            <p className="text-gray-300 text-sm">
              Total Income
            </p>

            <h2 className="text-3xl font-bold text-green-400 mt-2">
              ₹{income}
            </h2>
          </div>

          <div className="bg-red-900 rounded-2xl p-6">
            <p className="text-gray-300 text-sm">
              Total Expenses
            </p>

            <h2 className="text-3xl font-bold text-red-400 mt-2">
              ₹{expense}
            </h2>
          </div>
        </div>

        {/* Add Transaction Form */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            Add Transaction
          </h2>

          <form
            onSubmit={addTransaction}
            className="flex flex-col gap-3"
          >

            <div className="flex flex-col md:flex-row gap-3">

              <input
                className="bg-gray-700 p-3 rounded-lg w-full outline-none"
                placeholder="Title (e.g. Salary)"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                required
              />

              <input
                type="number"
                className="bg-gray-700 p-3 rounded-lg w-full outline-none"
                placeholder="Amount"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                required
              />
            </div>

            <div className="flex flex-col md:flex-row gap-3">

              <input
                className="bg-gray-700 p-3 rounded-lg w-full outline-none"
                placeholder="Category (Food, Salary etc.)"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                required
              />

              <select
                className="bg-gray-700 p-3 rounded-lg cursor-pointer outline-none"
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
              >
                <option value="income">
                  💚 Income
                </option>

                <option value="expense">
                  ❤️ Expense
                </option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold"
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </div>

        {/* Transactions List */}
        <div className="bg-gray-800 rounded-2xl p-6">

          <h2 className="text-xl font-bold mb-4">
            Recent Transactions
          </h2>

          {transactions.length === 0 && (
            <p className="text-gray-400 text-center py-8">
              No transactions yet — add one above 😊
            </p>
          )}
          {transactions.length>0 && (
              <div className="flex flex-col gap-3">

            {transactions.map((t) => (

              <div
                key={t._id}
                className="flex justify-between items-center bg-gray-700 p-4 rounded-xl"
              >

                <div className="flex items-center gap-4">

                  <div
                    className={`w-2 h-10 rounded-full ${
                      t.type === "income"
                        ? "bg-green-400"
                        : "bg-red-400"
                    }`}
                  ></div>

                  <div>
                    <p className="font-semibold">
                      {t.title}
                    </p>

                    <p className="text-sm text-gray-400">
                      {t.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">

                  <span
                    className={`font-bold text-lg ${
                      t.type === "income"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}₹
                    {t.amount}
                  </span>

                  <button
                    onClick={() =>
                      deleteTransaction(t._id)
                    }
                    className="bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700 text-sm transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>


          )}
          
        </div>

        {/* Charts */}
{transactions.length > 0 && (
  <div className="grid grid-cols-2 gap-4 mt-8">

    {/* Pie Chart */}
    <div className="bg-gray-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4">Income vs Expense</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {pieData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Bar Chart */}
    <div className="bg-gray-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4">Category Breakdown</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={categoryData}>
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#60a5fa" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

  </div>
)}
      </div>
    </div>
  )
}

export default Dashboard