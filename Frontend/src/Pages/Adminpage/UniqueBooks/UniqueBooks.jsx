import { useEffect, useState } from 'react'
import Navbar from '../../../Component/Navbar/Navbar'
import Footer from '../../../Component/Footer/Footer'
import API from '../../../Api/api'
import './UniqueBooks.css'
import { useNavigate } from 'react-router-dom'

export default function UniqueBooks() {
  const [books, setBooks] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const totalPages = Math.max(1, Math.ceil(books.length / pageSize))
  const [editingTitle, setEditingTitle] = useState(null)
  const [editValues, setEditValues] = useState({ Title: '', Author: '', Quantity: 0 })
  const [editImage, setEditImage] = useState(null)
  const navigate = useNavigate()

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

  const startEdit = (book) => {
    setEditingTitle(book.Title)
    setEditValues({ Title: book.Title, Author: book.Author, Quantity: book.Total_Quantity ?? book.Quantity ?? 0 })
    setEditImage(book.Image || null)
  }

  const cancelEdit = () => {
    setEditingTitle(null)
    setEditValues({ Title: '', Author: '', Quantity: 0 })
    setEditImage(null)
  }

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setEditImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const saveEdit = async () => {
    if (!editingTitle) return
    try {
      const bookData = {
        Title: editValues.Title,
        Author: editValues.Author,
        Quantity: Number(editValues.Quantity),
        Image: editImage
      }
      await API.put(`/book_update/${encodeURIComponent(editingTitle)}`, bookData)
      cancelEdit()
      fetchBooks()
      alert('Book updated')
    } catch (err) {
      console.error(err)
      alert('Update failed')
    }
  }

  const deleteBook = async (title) => {
    if (!window.confirm('Delete this book?')) return
    try {
      await API.delete(`/delete_book/${encodeURIComponent(title)}`)
      fetchBooks()
      alert('Book deleted')
    } catch (err) {
      console.error(err)
      alert('Delete failed')
    }
  }

  return (
    <>
      <Navbar />

      <div className="unique-books-container">
        <h1>Unique Books</h1>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Total Quantity</th>
              <th>Current Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.slice((page - 1) * pageSize, page * pageSize).map((book) => (
              <tr key={book.Id} className={editingTitle === book.Title ? 'editing-row' : ''}>
                <td>{book.Id}</td>
                <td>
                  {(book.Image) ? (
                    <img src={book.Image} alt={book.Title} style={{ height: 60, width: 45, objectFit: 'cover', borderRadius: 4 }} />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td>
                  {editingTitle === book.Title ? (
                    <input value={editValues.Title} onChange={(e) => setEditValues(v => ({ ...v, Title: e.target.value }))} />
                  ) : (
                    book.Title
                  )}
                </td>
                <td>
                  {editingTitle === book.Title ? (
                    <input value={editValues.Author} onChange={(e) => setEditValues(v => ({ ...v, Author: e.target.value }))} />
                  ) : (
                    book.Author
                  )}
                </td>
                <td>
                  {editingTitle === book.Title ? (
                    <input type="number" value={editValues.Quantity} onChange={(e) => setEditValues(v => ({ ...v, Quantity: e.target.value }))} />
                  ) : (
                    book.Total_Quantity ?? book.Quantity ?? 0
                  )}
                </td>
                <td>{book.Quantity ?? 0}</td>
                <td>
                  {editingTitle === book.Title ? (
                    <>
                      <input type="file" accept="image/*" onChange={handleImageChange} />
                      <button onClick={saveEdit} style={{ marginLeft: 8 }}>Save</button>
                      <button onClick={cancelEdit} style={{ marginLeft: 8 }}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(book)}>Edit</button>
                      <button onClick={() => deleteBook(book.Title)} style={{ marginLeft: 8 }}>Delete</button>
                      <button onClick={() => navigate(`/admin/unique-books/${encodeURIComponent(book.Title)}`)} style={{ marginLeft: 8 }}>View</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
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
