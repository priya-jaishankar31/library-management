import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../Component/Navbar/Navbar'
import Footer from '../../../Component/Footer/Footer'
import API from '../../../Api/api'
import './AvailableBooksAdmin.css'

export default function AvailableBooksAdmin() {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  const availableBooks = books.filter(b => (b.Quantity || 0) > 0)
  const totalPages = Math.max(1, Math.ceil(availableBooks.length / pageSize))
  const paginatedBooks = availableBooks.slice((page - 1) * pageSize, page * pageSize)

  const fetchBooks = async () => {
    try {
      const response = await API.get('/view_books/')
      setBooks(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const role = localStorage.getItem('role')
    if (role !== 'admin') {
      navigate('/login')
      return
    }

    fetchBooks()
  }, [navigate])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  return (
    <>
      <Navbar />
      <div className="available-admin-container">
        <div className="admin-page-header">
          <div>
            <button
            className="back-to-dashboard-btn"
            onClick={() => navigate('/admin-home')}
          >
            ← Back to Dashboard
          </button>
            <h1>Available Books</h1>
            <p className="admin-page-subtitle">Browse currently available stock in the library.</p>
          </div>
          
        </div>

        <div className="admin-page-card">
          <div className="table-overview">
            <span>{availableBooks.length} books currently available</span>
            <div className="page-size-select">
              <label>Rows:</label>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}>
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
              </select>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBooks.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-row">No available books found.</td>
                  </tr>
                ) : (
                  paginatedBooks.map((book) => (
                    <tr key={book.Id}>
                      <td>{book.Id}</td>
                      <td>{book.Title}</td>
                      <td>{book.Author}</td>
                      <td>{book.Quantity}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination-footer">
            <span>Page {page} of {totalPages}</span>
            <div className="pagination-actions">
              <button onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>Previous</button>
              <button onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page === totalPages}>Next</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
