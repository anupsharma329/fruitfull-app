import { useState, useEffect } from 'react'
import './app.css'

function App() {
  const [fruits, setFruits] = useState([])
  const [formData, setFormData] = useState({
    fruit_name: '',
    fruit_count: ''
  })
  const [loading, setLoading] = useState(false)

  const API_BASE_URL = 'http://localhost:8000'

  // Fetch fruits from backend
  const fetchFruits = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/fruits`)
      if (response.ok) {
        const data = await response.json()
        setFruits(data)
      }
    } catch (error) {
      console.error('Error fetching fruits:', error)
    }
  }

  // Load fruits on component mount
  useEffect(() => {
    fetchFruits()
  }, [])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.fruit_name.trim() || !formData.fruit_count) {
      alert('Please fill in both fields')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/fruits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fruit_name: formData.fruit_name.trim(),
          fruit_count: parseInt(formData.fruit_count)
        })
      })

      if (response.ok) {
        // Reset form
        setFormData({ fruit_name: '', fruit_count: '' })
        // Refresh fruits list
        await fetchFruits()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error adding fruit:', error)
      alert('Failed to add fruit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>🍎 Fruit Management System</h1>
      </header>

      <main>
        <section className="form-section">
          <h2>Add New Fruit</h2>
          <form onSubmit={handleSubmit} className="fruit-form">
            <div className="form-group">
              <label htmlFor="fruit_name">Fruit Name:</label>
              <input
                type="text"
                id="fruit_name"
                name="fruit_name"
                value={formData.fruit_name}
                onChange={handleInputChange}
                placeholder="Enter fruit name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fruit_count">Fruit Count:</label>
              <input
                type="number"
                id="fruit_count"
                name="fruit_count"
                value={formData.fruit_count}
                onChange={handleInputChange}
                placeholder="Enter count"
                min="1"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Adding...' : 'Add Fruit'}
            </button>
          </form>
        </section>

        <section className="table-section">
          <h2>Fruit Inventory</h2>
          {fruits.length === 0 ? (
            <p className="no-fruits">No fruits added yet. Add your first fruit above!</p>
          ) : (
            <div className="table-container">
              <table className="fruits-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fruit Name</th>
                    <th>Fruit Count</th>
                  </tr>
                </thead>
                <tbody>
                  {fruits.map((fruit) => (
                    <tr key={fruit.id}>
                      <td>{fruit.id}</td>
                      <td>{fruit.fruit_name}</td>
                      <td>{fruit.fruit_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
