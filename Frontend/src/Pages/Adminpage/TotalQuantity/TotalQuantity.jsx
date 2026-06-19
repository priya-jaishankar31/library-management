import { useEffect, useState } from 'react'
import Navbar from '../../../Component/Navbar/Navbar'
import Footer from '../../../Component/Footer/Footer'
import API from '../../../Api/api'
import './TotalQuantity.css'
import { useNavigate } from 'react-router-dom'

export default function TotalQuantity() {
  const [books, setBooks] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const navigate = useNavigate()
  const totalPages = Math.max(1, Math.ceil(books.length / pageSize))

  const fetchBooks = async () => {
    try {
      const response = await API.get('/view_books/')
      setBooks(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    (async () => {
      await fetchBooks()
      setPage(1)
    })()
  }, [pageSize])

  return (
    <>
      <Navbar />

      <div className="total-quantity-container">
        <h1>Total Quantity Books</h1>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Total Quantity</th>
              <th>Current Stock</th>
            </tr>
          </thead>
          <tbody>
            {books.slice((page - 1) * pageSize, page * pageSize).map((book) => (
              <tr key={book.Id}>
                <td>{book.Id}</td>
                <td>{book.Title}</td>
                <td>{book.Author}</td>
                <td>{book.Total_Quantity ?? book.Quantity ?? 0}</td>
                <td>{book.Quantity ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination-controls">
          <div className="page-info">Page {page} of {totalPages}</div>
          <div className="page-buttons">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous">&lt;</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next">&gt;</button>
          </div>
          <div className="page-size-select">
            <label>Rows:</label>
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>

      </div>

      <Footer />
    </>
  )
}
