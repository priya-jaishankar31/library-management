import { useState, useEffect } from 'react'
import './Adminhome.css'
import Navbar from '../../../Component/Navbar/Navbar'
import Footer from '../../../Component/Footer/Footer'
import Adminlogo from '../../../assets/adminlogo.jpg'
import { useNavigate } from 'react-router-dom'
import API from "../../../Api/api";

export default function Adminhome() {

    const navigate = useNavigate()
    // Redirect to login if not authenticated as admin
    useEffect(() => {
        const role = localStorage.getItem('role')
        if (role !== 'admin') {
            navigate('/login')
        }
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('username')
        localStorage.removeItem('isAuthenticated')
        navigate('/login')
    }

    // BOOKS STATE
    const [books, setBooks] = useState([])
    const [users, setUsers] = useState([])
    const [borrowedRecords, setBorrowedRecords] = useState([])

    const fetchBooks = async () => {
        try {
            const response = await API.get('/view_books/')
            setBooks(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUsers = async () => {
        try {
            const response = await API.get('/users/')
            setUsers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchBorrowedRecords = async () => {
        try {
            const response = await API.get('/get_borrow/')
            setBorrowedRecords(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        (async () => {
            await fetchBooks()
            await fetchBorrowedRecords()
            await fetchUsers()
        })()
    }, [])


    // BOOK INPUT STATES
    const [newBookTitle, setNewBookTitle] = useState('')
    const [newBookAuthor, setNewBookAuthor] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [bookImage, setBookImage] = useState(null)
    const [bookImages, setBookImages] = useState({})
    const [editMode, setEditMode] = useState(false)
    const [editOriginalTitle, setEditOriginalTitle] = useState('')

    // IMAGE UPLOAD
    const handleImageUpload = (e) => {

        const file = e.target.files[0]

        if (file) {

            const reader = new FileReader()

            reader.onloadend = () => {
                setBookImage(reader.result)
            }

            reader.readAsDataURL(file)
        }
    }

    // ADD BOOK
    const addBook = async () => {

    if (!newBookTitle || !newBookAuthor) {

        alert('Please enter book details')
        return
    }

    try {

        const bookData = {
            Title: newBookTitle,
            Author: newBookAuthor,
            Quantity: quantity,
            Image: bookImage
        }

        const response = await API.post(
            '/add_book/',
            bookData
        )

        console.log(response.data)

        if (bookImage) {
            setBookImages(prev => ({
                ...prev,
                [response.data.Id]: bookImage
            }))
        }

        alert('Book Added Successfully')

        fetchBooks()

        resetBookForm()

    }

    catch (error) {

        console.log(error)

        if (error.response) {

            alert(
                JSON.stringify(error.response.data)
            )

        } else {

            alert('Server Error')
        }
    }
}

    const updateBook = async () => {

    if (!editOriginalTitle) {
        return
    }

    if (!newBookTitle || !newBookAuthor) {
        alert('Please enter book details')
        return
    }

    try {
        const bookData = {
            Title: newBookTitle,
            Author: newBookAuthor,
            Quantity: quantity,
            Image: bookImage
        }

        await API.put(
            `/book_update/${encodeURIComponent(editOriginalTitle)}`,
            bookData
        )

        alert('Book Updated Successfully')

        fetchBooks()
        resetBookForm()

    } catch (error) {
        console.log(error)
        if (error.response) {
            alert(JSON.stringify(error.response.data))
        } else {
            alert('Update Failed')
        }
    }
}

    const resetBookForm = () => {
        setEditMode(false)
        setEditOriginalTitle('')
        setNewBookTitle('')
        setNewBookAuthor('')
        setQuantity(1)
        setBookImage(null)
    }

    const handleEditBook = (book) => {
        setEditMode(true)
        setEditOriginalTitle(book.Title)
        setNewBookTitle(book.Title)
        setNewBookAuthor(book.Author)
        setQuantity(book.Quantity || 1)
        setBookImage(book.Image || book.image || null)
        setSelectedSection('books')
    }

    // DELETE BOOK
    const deleteBook = async (title) => {

    try {

        await API.delete(
            `/delete_book/${title}`
        )

        alert('Book Deleted')

        fetchBooks()

    }

    catch (error) {

        console.log(error)

        alert('Delete Failed')
    }
}

    // FILTERS
    const borrowedBooks = borrowedRecords
    const availableBooks = books.filter(
        b => (b.Quantity || 0) > 0
    )

    // FINE CALCULATION
    const calculateFine = (dueDate, returned) => {

        if (returned || dueDate === '-') return 0

        const today = new Date()
        const due = new Date(dueDate)

        const diff = today - due

        const days = Math.floor(
            diff / (1000 * 60 * 60 * 24)
        )

        return days > 0 ? days * 10 : 0
    }


    return (
        <>
            <Navbar />

            <div className="admin-home-container">

                {/* HEADER */}
                <div className="admin-top-section">

                    <img
                        src={Adminlogo}
                        className="admin-logo"
                        alt="Admin"
                    />

                    <div>
                        <h1 className="admin-welcome">Welcome, Admin!</h1>

                        <p className="admin-subtitle">
                            Library Management System
                        </p>
                    </div>

                    <button
                        className="admin-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

                {/* ADD BOOK */}
                <div className="add-book-section">

                    <input
                        type="text"
                        placeholder="Book Title"
                        value={newBookTitle}
                        onChange={(e) =>
                            setNewBookTitle(e.target.value.toUpperCase())
                        }
                    />

                    <input
                        type="text"
                        placeholder="Author"
                        value={newBookAuthor}
                        onChange={(e) =>
                            setNewBookAuthor(e.target.value.toUpperCase())
                        }
                    />

                    <div className="quantity-controls">

                        {quantity > 0 && (
                            <button
                                onClick={() =>
                                    setQuantity(
                                        quantity > 1
                                            ? quantity - 1
                                            : 0
                                    )
                                }
                            >
                                -
                            </button>
                        )}

                        <span>{quantity}</span>

                        <button onClick={() => setQuantity(quantity + 1)}>
                            +
                        </button>

                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />

                    {bookImage && (

                        <div className="image-preview">

                            <img
                                src={bookImage}
                                alt="Preview"
                                style={{
                                    height: '80px',
                                    width: '60px',
                                    objectFit: 'cover'
                                }}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setBookImage(null)
                                }
                            >
                                Remove
                            </button>

                        </div>
                    )}

                    <button onClick={editMode ? updateBook : addBook}>
                        {editMode ? 'Update Book' : 'Add Book'}
                    </button>

                    {editMode && (
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={resetBookForm}
                            style={{ marginLeft: '12px' }}
                        >
                            Cancel
                        </button>
                    )}

                </div>

                {/* DASHBOARD */}
                <div className="dashboard-cards">

                    <div
                        className="dashboard-card card-blue"
                        onClick={() =>
                            navigate('/admin/unique-books')
                        }
                    >
                        <h3>Total Unique Books</h3>
                        <p>{books.length}</p>
                    </div>

                    <div
                        className="dashboard-card card-green"
                        onClick={() =>
                            navigate('/admin/total-quantity')
                        }
                    >
                        <h3>Total Quantity Books</h3>
                        <p>{books.reduce(
                            (total, book) =>
                                total + (Number(book.Total_Quantity || book.Quantity || 0) || 0),
                            0
                        )}</p>
                    </div>

                    <div
                        className="dashboard-card card-orange"
                        onClick={() =>
                            navigate('/admin/users')
                        }
                    >
                        <h3>Total Users</h3>
                        <p>{users.length}</p>
                    </div>

                                    <div
                        className="dashboard-card card-red"
                        onClick={() =>
                            navigate('/admin/borrowed-books')
                        }
                    >
                        <h3>Borrowed Books</h3>
                        <p>{borrowedBooks.reduce(
                            (total, book) =>
                                total + (Number(book.Quantity) || 0),
                            0
                        )}</p>
                    </div>

                    <div
                        className="dashboard-card card-yellow"
                        onClick={() =>
                            navigate('/admin/available-books')
                        }
                    >
                        <h3>Available Books</h3>
                        <p>{availableBooks.reduce(
                            (total, book) =>
                                total + (Number(book.Quantity) || 0),
                            0
                        )}</p>
                    </div>

                </div>

                {/* DETAILS */}
                <div className="details-section">
                    <div className="details-intro">
                        <p>Select a section from the dashboard to view it on its own page.</p>
                    </div>
                </div>

            </div>

            <Footer />
        </>
    )
}