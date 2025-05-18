import React, { useState, useEffect } from "react";

const ExpenseTracker = () => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });
  const [expenses, setExpenses] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [editId, setEditId] = useState(null);

  
  useEffect(() => {
    const data = localStorage.getItem("expenses");
    if (data) setExpenses(JSON.parse(data));
  }, []);

  
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    const { title, amount, category, date } = formData;
    if (!title || !amount || !category || !date) {
      alert("Please fill in all fields.");
      return;
    }

    const newExpense = {
      id: editId || Date.now(),
      title,
      amount: parseFloat(amount),
      category,
      date,
    };

    if (editId) {
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === editId ? newExpense : exp))
      );
      setEditId(null);
    } else {
      setExpenses((prev) => [newExpense, ...prev]);
    }

    setFormData({ title: "", amount: "", category: "", date: "" });
  };

  const handleDelete = (id) => {
    const confirmed = alert("Delete this expense?");
    if (confirmed) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
    });
    setEditId(expense.id);
  };

  const filtered = expenses
    .filter((e) =>
      e.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      e.category.toLowerCase().includes(searchInput.toLowerCase())
    )
    .filter((e) => (filterCategory ? e.category === filterCategory : true))
    .filter((e) => (filterDate ? e.date === filterDate : true));

  const totalThisMonth = expenses.reduce(
    (acc, curr) => acc + parseFloat(curr.amount),
    0
  );

  const categoryBreakdown = expenses.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = 0;
    acc[curr.category] += parseFloat(curr.amount);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "1rem" }}>
      <h1 style={{ textAlign: "center" }}>Expense Tracker</h1>

      
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: "1", border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
          <h3>Monthly Total</h3>
          <h2>₹ {totalThisMonth.toFixed(2)}</h2>
        </div>
        <div style={{ flex: "1", border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
          <h3>Category Breakdown</h3>
          {Object.entries(categoryBreakdown).map(([cat, amt]) => (
            <div key={cat}>
              {cat}: ₹{amt.toFixed(2)}
            </div>
          ))}
        </div>
      </div>

      
      <div style={{ marginTop: "2rem" }}>
        <h2>{editId ? "Edit Expense" : "Add New Expense"}</h2>
        <form onSubmit={handleAddOrUpdate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
          />
          <input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            required
          />
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option>Food</option>
            <option>Transport</option>
            <option>Entertainment</option>
            <option>Bills</option>
          </select>
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <button type="submit" style={{ padding: "0.5rem" }}>
            {editId ? "Update" : "Add"} Expense
          </button>
        </form>
      </div>

      
      <div style={{ marginTop: "2rem" }}>
        <h2>Expense History</h2>
        <input
          type="search"
          placeholder="Search by title/category"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ marginRight: "1rem" }}
        />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ marginRight: "1rem" }}>
          <option value="">All Categories</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Entertainment</option>
          <option>Bills</option>
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      
      <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
        {filtered.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          filtered.map((e) => (
            <li key={e.id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
              <div><strong>{e.title}</strong> - ₹{e.amount.toFixed(2)}</div>
              <div>Category: {e.category}</div>
              <div>Date: {e.date}</div>
              <button onClick={() => handleEdit(e)} style={{ marginRight: "0.5rem" }}>Edit</button>
              <button onClick={() => handleDelete(e.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ExpenseTracker;
