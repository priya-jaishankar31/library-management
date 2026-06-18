import React, { useEffect, useState } from 'react'
import './ReturnBooks.css'
import Navbar from '../../../Component/Navbar/Navbar'
import Footer from '../../../Component/Footer/Footer'
import API from '../../../Api/api'
import { useNavigate } from 'react-router-dom'

export default function ReturnBooks() {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [outstandingFine, setOutstandingFine] = useState(0)
    const [borrowedBooks, setBorrowedBooks] = useState([])
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [payAmount, setPayAmount] = useState('')
    const [isPaying, setIsPaying] = useState(false)

    useEffect(() => {
        const user = localStorage.getItem('username')
        const role = localStorage.getItem('role')

        if (!user || role !== 'user') {
            navigate('/login')
            return
        }

        fetchBorrowedBooks(user)
        fetchOutstandingFine(user)
    }, [navigate])

    const fetchBorrowedBooks = async (user) => {
        try {
            const response = await API.get(`/borrow_getbyID/${encodeURIComponent(user)}`)
            setBorrowedBooks(response.data)
        } catch (err) {
            console.error(err)
        }
    }

    const fetchOutstandingFine = async (user) => {
        try {
            const response = await API.get('/view_fine/', { params: { userid: user } })
            const data = response.data
            if (typeof data === 'number') {
                setOutstandingFine(data)
            } else if (data?.remaining_fine !== undefined) {
                setOutstandingFine(data.remaining_fine)
            } else if (data?.message && data.message.toLowerCase().includes('no outstanding')) {
                setOutstandingFine(0)
            } else {
                setOutstandingFine(0)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handlePayFine = async () => {
        const user = localStorage.getItem('username')
        setError('')
        setMessage('')

        const amount = Number(payAmount)
        if (!amount || amount <= 0) {
            setError('Enter a valid payment amount.')
            return
        }

        if (amount > outstandingFine) {
            setError('Payment cannot exceed the outstanding fine.')
            return
        }

        setIsPaying(true)
        try {
            const response = await API.put(`/pay_fine/${encodeURIComponent(user)}`, null, {
                params: { amount }
            })
            setMessage(response.data.message || 'Fine paid successfully.')
            setOutstandingFine(response.data.remaining_fine ?? 0)
            setPayAmount('')
        } catch (err) {
            setError(err.response?.data?.detail || 'Fine payment failed.')
        } finally {
            setIsPaying(false)
        }
    }

    const handleReturn = async () => {
        const user = localStorage.getItem('username')
        setError('')
        setMessage('')

        if (outstandingFine > 0) {
            setError('Please pay your outstanding fine before returning books.')
            return
        }

        if (!title.trim()) {
            setError('Enter the title of the book to return.')
            return
        }

        if (quantity < 1) {
            setError('Return quantity must be at least 1.')
            return
        }

        try {
            const response = await API.post('/return_book/', {
                Title: title.trim(),
                UserId: user,
                Quantity: quantity
            })
            setMessage(`Return successful: ${response.data.Title} x${response.data.Quantity}`)
            setTitle('')
            setQuantity(1)
            fetchBorrowedBooks(user)
            fetchOutstandingFine(user)
        } catch (err) {
            const detail = err.response?.data?.detail || err.response?.data || err.message
            setError(detail)
        }
    }

    return (
        <>
            <Navbar />

            <div className="return-container">
                <div className="return-card">
                    <h1>Return Books</h1>
                    <p className="return-description">
                        Return a book by entering its title and the number of copies. If you have an outstanding fine,
                        pay it first before returning new books.
                    </p>

                    <div className="return-fields">
                        <label>
                            Book Title
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter book title"
                            />
                        </label>

                        <label>
                            Quantity
                            <input
                                type="number"
                                min="1"
                                max="3"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                            />
                        </label>
                    </div>

                    <div className="fine-card">
                        <div>
                            <h2>Outstanding Fine</h2>
                            <p className="fine-value">
                                {outstandingFine >= 0 ? `₹${outstandingFine}` : 'No pending fine'}
                            </p>
                        </div>

                        {outstandingFine > 0 && (
                            <div className="fine-pay-section">
                                <input
                                    type="number"
                                    min="1"
                                    value={payAmount}
                                    onChange={(e) => setPayAmount(e.target.value)}
                                    placeholder="Enter payment amount"
                                />
                                <button
                                    className="pay-fine-btn"
                                    onClick={handlePayFine}
                                    disabled={isPaying}
                                >
                                    {isPaying ? 'Paying...' : 'Pay Fine'}
                                </button>
                            </div>
                        )}
                    </div>

                    {error && <div className="alert error">{error}</div>}
                    {message && <div className="alert success">{message}</div>}

                    <button
                        className="return-btn"
                        onClick={handleReturn}
                        disabled={outstandingFine > 0}
                    >
                        Return Book
                    </button>

                    <div className="borrowed-preview">
                        <h2>Your Borrowed Books</h2>
                        {borrowedBooks.length === 0 ? (
                            <p>No borrowed books found.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Quantity</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {borrowedBooks.map((borrow) => (
                                        <tr key={`${borrow.Title}-${borrow.Due_Date}-${borrow.UserId}`}>
                                            <td>{borrow.Title}</td>
                                            <td>{borrow.Quantity}</td>
                                            <td>{borrow.Due_Date ? new Date(borrow.Due_Date).toLocaleDateString() : '-'}</td>
                                            <td>{borrow.Status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}
