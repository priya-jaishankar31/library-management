import React, { useState, useEffect } from 'react'
import './Adminhome.css'
import Navbar from '../../../Component/Navbar/Navbar'
import Footer from '../../../Component/Footer/Footer'
import Adminlogo from '../../../assets/adminlogo.jpg'
import { useNavigate } from 'react-router-dom'

export default function Adminhome() {

    const navigate = useNavigate()

    const handleLogout = () => {
        navigate('/')
    }

    // DEFAULT BOOKS
    // const defaultBooksInitial = [
    //     {
    //         id: 1,
    //         title: 'Atomic Habits',
    //         author: 'James Clear',
    //         status: 'Borrowed',
    //         returned: false,
    //         borrowedBy: 'Shyam',
    //         dueDate: '2026-05-10'
    //     },
    //     {
    //         id: 2,
    //         title: 'The Alchemist',
    //         author: 'Paulo Coelho',
    //         status: 'Available',
    //         returned: false,
    //         borrowedBy: '-',
    //         dueDate: '-'
    //     },
    //     {
    //         id: 3,
    //         title: 'Rich Dad Poor Dad',
    //         author: 'Robert Kiyosaki',
    //         status: 'Borrowed',
    //         returned: true,
    //         borrowedBy: 'Priya',
    //         dueDate: '2026-05-12'
    //     }
    // ]

    // BOOKS STATE
    const [books, setBooks] = useState(() => {
        const savedBooks = localStorage.getItem('libraryBooks')
        return savedBooks ? JSON.parse(savedBooks) : []
    })

    // USERS STATE - FROM LOCALSTORAGE
    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('libraryUsers')
        return savedUsers ? JSON.parse(savedUsers) : [
            { id: 1, name: 'Shyam', email: 'shyam@gmail.com', password: 'shyam123' },
            { id: 2, name: 'Priya', email: 'priya@gmail.com', password: 'priya123' },
            { id: 3, name: 'Rahul', email: 'rahul@gmail.com', password: 'rahul123' }
        ]
    })

    // SAVE BOOKS TO LOCALSTORAGE WHENEVER THEY CHANGE
    useEffect(() => {
        localStorage.setItem('libraryBooks', JSON.stringify(books))
    }, [books])

    // SAVE USERS TO LOCALSTORAGE WHENEVER THEY CHANGE
    useEffect(() => {
        localStorage.setItem('libraryUsers', JSON.stringify(users))
    }, [users])

    //  ADD BOOK INPUT STATES
    const [newBookTitle, setNewBookTitle] = useState('')
    const [newBookAuthor, setNewBookAuthor] = useState('')
    const [quantity, setQuantity] = useState(1)

    // ADD USER INPUT STATES
    const [newUserName, setNewUserName] = useState('')
    const [newUserEmail, setNewUserEmail] = useState('')
    const [newUserPassword, setNewUserPassword] = useState('')

    //  ADD BOOK FUNCTION
    const addBook = () => {

        if (!newBookTitle || !newBookAuthor) {
            alert("Please enter book details")
            return
        }

        const existingBook = books.find(
            (book) =>
                book.title.toLowerCase() === newBookTitle.toLowerCase() &&
                book.author.toLowerCase() === newBookAuthor.toLowerCase()
        )

        if (existingBook) {

            const updatedBooks = books.map((book) =>
                book.id === existingBook.id
                    ? {
                        ...book,
                        quantity: (book.quantity || 1) + quantity
                    }
                    : book
            )

            setBooks(updatedBooks)

        } else {

            const newBook = {
                id: books.length + 1,
                title: newBookTitle,
                author: newBookAuthor,
                quantity: quantity,
                status: 'Available',
                returned: false,
                borrowedBy: '-',
                dueDate: '-'
            }

            setBooks([...books, newBook])
        }

        setNewBookTitle('')
        setNewBookAuthor('')
        setQuantity(1)
    }

    // DELETE BOOK FUNCTION
    const deleteBook = (bookId) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            const updatedBooks = books.filter(book => book.id !== bookId)
            setBooks(updatedBooks)
        }
    }

    // ADD USER FUNCTION
    const addUser = () => {
        if (!newUserName || !newUserEmail || !newUserPassword) {
            alert("Please enter all user details")
            return
        }

        const userExists = users.find(u => u.email.toLowerCase() === newUserEmail.toLowerCase())
        if (userExists) {
            alert("User with this email already exists")
            return
        }

        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            name: newUserName,
            email: newUserEmail,
            password: newUserPassword
        }

        setUsers([...users, newUser])
        setNewUserName('')
        setNewUserEmail('')
        setNewUserPassword('')
    }

    // DELETE USER FUNCTION
    const deleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            const updatedUsers = users.filter(user => user.id !== userId)
            setUsers(updatedUsers)
        }
    }

    //  FILTERS
    const borrowedBooks = books.filter(b => b.status === 'Borrowed')
    const availableBooks = books.filter(b => b.status === 'Available')

    //  FINE CALCULATION
    const calculateFine = (dueDate, returned) => {

        if (returned || dueDate === '-') return 0

        const today = new Date()
        const due = new Date(dueDate)  

        const diff = today - due
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))

        return days > 0 ? days * 10 : 0
    }

    const [selectedSection, setSelectedSection] = useState('')

    return (
        <>
            <Navbar />

            <div className="admin-home-container">

                {/*  HEADER */}
                <div className="admin-top-section">

                    <img src={Adminlogo} className="admin-logo" />

                    <div>
                        <h1 className="admin-welcome">Welcome, Admin!</h1>
                        <p className="admin-subtitle">Library Management System</p>
                    </div>

                    <button className="admin-logout-btn" onClick={handleLogout}>
                        Logout
                    </button>

                </div>

                {/* ADD BOOK */}
                <div className="add-book-section">

                    <input
                        type="text"
                        placeholder="Book Title"
                        value={newBookTitle}
                        onChange={(e) => setNewBookTitle(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Author"
                        value={newBookAuthor}
                        onChange={(e) => setNewBookAuthor(e.target.value)}
                    />

                    <div className="quantity-controls">

                        <button
                            onClick={() =>
                                setQuantity(quantity > 1 ? quantity - 1 : 1)
                            }
                        >
                            -
                        </button>

                        <span>{quantity}</span>

                        <button
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            +
                        </button>

                    </div>

                    <button onClick={addBook}>
                        Add Book
                    </button>

                </div>

                {/*  DASHBOARD */}
                <div className="dashboard-cards">

                    <div className="dashboard-card" onClick={() => setSelectedSection('books')}>
                        <h3>Total Books</h3>
                        <p>{books.length}</p>
                    </div>

                    <div className="dashboard-card" onClick={() => setSelectedSection('users')}>
                        <h3>Total Users</h3>
                        <p>{users.length}</p>
                    </div>

                    <div className="dashboard-card" onClick={() => setSelectedSection('borrowed')}>
                        <h3>Borrowed Books</h3>
                        <p>{borrowedBooks.length}</p>
                    </div>

                    <div className="dashboard-card" onClick={() => setSelectedSection('available')}>
                        <h3>Available Books</h3>
                        <p>{availableBooks.length}</p>
                    </div>

                </div>

                {/* DETAILS SECTION */}
                <div className="details-section">

                    {/* All Books*/}
                    {selectedSection === 'books' && (

                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Status</th>
                                    <th>Borrowed By</th>
                                    <th>Returned</th>
                                    <th>Due Date</th>
                                    <th>Fine</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {books.map(book => (
                                    <tr key={book.id}>

                                        <td>{book.id}</td>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>

                                        <td>
                                            {book.status === 'Available'
                                                ? 'Available'
                                                : 'Borrowed'}
                                        </td>

                                        <td>{book.borrowedBy}</td>

                                        <td>
                                            {book.status === 'Available'
                                                ? '-'
                                                : book.returned
                                                    ? 'Returned'
                                                    : 'Not Returned'}
                                        </td>

                                        <td>
                                            {book.status === 'Available'
                                                ? '-'
                                                : book.dueDate}
                                        </td>

                                        <td>
                                            {book.status === 'Available'
                                                ? '-'
                                                : calculateFine(book.dueDate, book.returned) > 0
                                                    ? `₹${calculateFine(book.dueDate, book.returned)}`
                                                    : 'No Fine'}
                                        </td>

                                        <td>
                                            <button 
                                                onClick={() => deleteBook(book.id)}
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

                    {/* User */}
                    {selectedSection === 'users' && (
                        <>
                            <div className="add-user-section">
                                <h3>Add New User</h3>
                                <input
                                    type="text"
                                    placeholder="User Name"
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                />

                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={newUserPassword}
                                    onChange={(e) => setNewUserPassword(e.target.value)}
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
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>
                                                <button 
                                                    onClick={() => deleteUser(u.id)}
                                                    className="delete-btn"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {/* Borrowed */}
                    {selectedSection === 'borrowed' && (

                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Borrowed By</th>
                                    <th>Due Date</th>
                                    <th>Fine</th>
                                </tr>
                            </thead>

                            <tbody>
                                {borrowedBooks.map(b => (
                                    <tr key={b.id}>
                                        <td>{b.title}</td>
                                        <td>{b.borrowedBy}</td>
                                        <td>{b.dueDate}</td>
                                        <td>
                                            {calculateFine(b.dueDate, b.returned) > 0
                                                ? `₹${calculateFine(b.dueDate, b.returned)}`
                                                : 'No Fine'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/*  Available */}
                    {selectedSection === 'available' && (

                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                </tr>
                            </thead>

                            <tbody>
                                {availableBooks.map(b => (
                                    <tr key={b.id}>
                                        <td>{b.id}</td>
                                        <td>{b.title}</td>
                                        <td>{b.author}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                </div>

            </div>

            <Footer />
        </>
    )
}