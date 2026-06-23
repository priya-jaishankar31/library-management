import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../Component/Navbar/Navbar'
import Footer from '../../../Component/Footer/Footer'
import API from '../../../Api/api'
import './BorrowedBooksAdmin.css'

export default function BorrowedBooksAdmin() {
  const navigate = useNavigate()
  const [borrowedRecords, setBorrowedRecords] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  const totalBorrowedBooks = borrowedRecords.reduce(
    (total, record) => total + (Number(record.Quantity) || 0),
    0
  )
  const totalPages = Math.max(1, Math.ceil(borrowedRecords.length / pageSize))
  const paginatedRecords = borrowedRecords.slice((page - 1) * pageSize, page * pageSize)

  const fetchBorrowedRecords = async () => {
    try {
      const response = await API.get('/get_borrow/')
      setBorrowedRecords(response.data)
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

    fetchBorrowedRecords()
  }, [navigate])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  return (
    <>
      <Navbar />
      <div className="borrowed-admin-container">
        <div className="admin-page-header">
          <div>
            <button
            className="back-to-dashboard-btn"
            onClick={() => navigate('/admin-home')}
          >
            ← Back to Dashboard
          </button>
            <h1>Borrowed Books</h1>
            <p className="admin-page-subtitle">View all borrowed book records with pagination.</p>
          </div>
          
        </div>

        <div className="admin-page-card">
          <div className="table-overview">
            <span>{totalBorrowedBooks} total borrowed books</span>
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
                  <th>Title</th>
                  <th>User</th>
                  <th>Quantity</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-row">No borrowed records found.</td>
                  </tr>
                ) : (
                  paginatedRecords.map((borrow) => (
                    <tr key={`${borrow.Title}-${borrow.UserId}-${borrow.Due_Date}`}>
                      <td>{borrow.Title}</td>
                      <td>{borrow.UserId}</td>
                      <td>{borrow.Quantity}</td>
                      <td>{borrow.Due_Date}</td>
                      <td>{borrow.Status}</td>
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
