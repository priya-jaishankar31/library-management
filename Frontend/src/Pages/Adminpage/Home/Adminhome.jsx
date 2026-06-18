import React, { useState, useEffect } from 'react'
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
    const [selectedSection, setSelectedSection] = useState('books')

    const fetchBooks = async () => {
        try {
            const response = await API.get('/view_books/')
            setBooks(response.data)
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

    const fetchUsers = async () => {
        try {
            const response = await API.get('/users/')
            setUsers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchBooks()
        fetchBorrowedRecords()
        fetchUsers()
    }, [])


    // BOOK INPUT STATES
    const [newBookTitle, setNewBookTitle] = useState('')
    const [newBookAuthor, setNewBookAuthor] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [bookImage, setBookImage] = useState(null)
    const [bookImages, setBookImages] = useState({})
    const [editMode, setEditMode] = useState(false)
    const [editOriginalTitle, setEditOriginalTitle] = useState('')

    // USER INPUT STATES
    const [newUserName, setNewUserName] = useState('')
    const [newUserEmail, setNewUserEmail] = useState('')
    const [newUserPassword, setNewUserPassword] = useState('')

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
    const createUserId = name => {
        const base = name
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '')

        const padded = base.length >= 4 ? base.slice(0, 10) : base.padEnd(4, 'user')
        const suffix = Math.floor(100 + Math.random() * 900)

        return `${padded}${suffix}`
    }

    // ADD USER
    const addUser = async () => {

        if (
            !newUserName ||
            !newUserEmail ||
            !newUserPassword
        ) {
            alert('Please enter all user details')
            return
        }

        const emailLower = newUserEmail.toLowerCase()

        const userExists = users.find(
            u => u.Email?.toLowerCase() === emailLower
        )

        if (userExists) {
            alert('User already exists')
            return
        }

        const userData = {
            Name: newUserName,
            UserId: createUserId(newUserName),
            Email: newUserEmail,
            Password: newUserPassword,
            Role: 'user'
        }

        try {
            await API.post('/users/', userData)
            alert('User Added Successfully')
            fetchUsers()
            setNewUserName('')
            setNewUserEmail('')
            setNewUserPassword('')
        } catch (error) {
            console.log(error)
            if (error.response) {
                alert(JSON.stringify(error.response.data))
            } else {
                alert('Server Error')
            }
        }
    }

    // DELETE USER
    const deleteUser = async (userId) => {

        if (
            window.confirm(
                'Are you sure you want to delete this user?'
            )
        ) {

            try {
                await API.delete(`/user_delete/${encodeURIComponent(userId)}`)
                alert('User Deleted')
                fetchUsers()
            } catch (error) {
                console.log(error)
                alert('Delete Failed')
            }
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
                        <h1 className="admin-welcome">
                            Welcome, Admin!
                        </h1>

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
                            setNewBookTitle(e.target.value)
                        }
                    />

                    <input
                        type="text"
                        placeholder="Author"
                        value={newBookAuthor}
                        onChange={(e) =>
                            setNewBookAuthor(e.target.value)
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
                        className="dashboard-card"
                        onClick={() =>
                            setSelectedSection('books')
                        }
                    >
                        <h3>Total Unique Books</h3>
                        <p>{books.length}</p>
                    </div>

                    <div
                        className="dashboard-card"
                        onClick={() =>
                            setSelectedSection('totalQuantity')
                        }
                    >
                        <h3>Total Quantity Books</h3>
                        <p>{books.reduce(
                            (total, book) =>
                                total + (book.Total_Quantity || 0),
                            0
                        )}</p>
                    </div>

                    <div
                        className="dashboard-card"
                        onClick={() =>
                            setSelectedSection('users')
                        }
                    >
                        <h3>Total Users</h3>
                        <p>{users.length}</p>
                    </div>

                    <div
                        className="dashboard-card"
                        onClick={() =>
                            setSelectedSection('borrowed')
                        }
                    >
                        <h3>Borrowed Books</h3>
                        <p>{borrowedBooks.reduce(
                            (total, book) =>
                                total + (book.Quantity || 0),
                            0
                        )}</p>
                    </div>

                    <div
                        className="dashboard-card"
                        onClick={() =>
                            setSelectedSection('available')
                        }
                    >
                        <h3>Available Books</h3>
                        <p>{availableBooks.reduce(
                            (total, book) =>
                                total + (book.Quantity || 0),
                            0
                        )}</p>
                    </div>

                </div>

                {/* DETAILS */}
                <div className="details-section">

                    {/* BOOKS */}
                    {selectedSection === 'books' && (

                        <table>

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Image</th>
                                    <th>Quantity</th>
                                    <th>Action</th>
                                </tr>

                            </thead>

                            <tbody>

                                {books.map(book => (

                                    <tr key={book.Id}>

                                        <td>{book.Id}</td>

                                        <td>{book.Title}</td>

                                        <td>{book.Author}</td>

                                        <td>

                                            {(bookImages[book.Id] || bookImages[book.Title] || book.Image || book.image) ? (

                                                <img
                                                    src={bookImages[book.Id] || bookImages[book.Title] || book.Image || book.image}
                                                    alt={book.Title}
                                                    style={{
                                                        height: '50px',
                                                        width: '40px',
                                                        objectFit: 'cover',
                                                        borderRadius: '4px'
                                                    }}
                                                />

                                            ) : (
                                                'No Image'
                                            )}

                                        </td>

                                        <td>
                                            {book.Quantity || 1}
                                        </td>

                                        <td>
                                            <button
                                                
                                                onClick={() => handleEditBook(book)}
                                                className="edit-btn"
                                                style={{ marginRight: '8px' }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    deleteBook(book.Title)
                                                }
                                                className="delete-btn"
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>
                    )}

                    {/* TOTAL QUANTITY BOOKS */}
                    {selectedSection === 'totalQuantity' && (
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
                                {books.map((book) => (
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
                    )}

                    {/* BORROWED BOOKS */}
                    {selectedSection === 'borrowed' && (
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
                                {borrowedRecords.map((borrow) => (
                                    <tr key={`${borrow.Title}-${borrow.UserId}-${borrow.Due_Date}`}>
                                        <td>{borrow.Title}</td>
                                        <td>{borrow.UserId}</td>
                                        <td>{borrow.Quantity}</td>
                                        <td>{borrow.Due_Date}</td>
                                        <td>{borrow.Status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* AVAILABLE BOOKS */}
                    {selectedSection === 'available' && (
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
                                {availableBooks.map((book) => (
                                    <tr key={book.Id}>
                                        <td>{book.Id}</td>
                                        <td>{book.Title}</td>
                                        <td>{book.Author}</td>
                                        <td>{book.Quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* USERS */}
                    {selectedSection === 'users' && (

                        <>

                            <div className="add-user-section">

                                <h3>Add User</h3>

                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={newUserName}
                                    onChange={(e) =>
                                        setNewUserName(e.target.value)
                                    }
                                />

                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newUserEmail}
                                    onChange={(e) =>
                                        setNewUserEmail(e.target.value)
                                    }
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={newUserPassword}
                                    onChange={(e) =>
                                        setNewUserPassword(e.target.value)
                                    }
                                />

                                <button onClick={addUser}>
                                    Add User
                                </button>

                            </div>

                            <table>

                                <thead>

                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Action</th>
                                        <th>Role</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {users.map(user => (

                                        <tr key={user.Id}>

                                            <td>{user.Id}</td>

                                            <td>{user.Name}</td>

                                            <td>{user.Email}</td>

                                            <td>

                                                <button
                                                    onClick={() =>
                                                        deleteUser(user.Id)
                                                    }
                                                    className="delete-btn"
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                            <td>{user.Role}</td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </>
                    )}

                </div>

            </div>

            <Footer />
        </>
    )
}