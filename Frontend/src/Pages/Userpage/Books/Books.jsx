import React, { useEffect, useState } from 'react'
import './Books.css'
import Navbar from "../../../Component/Navbar/Navbar"
import Footer from '../../../Component/Footer/Footer'
import API from '../../../Api/api'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Books({ username }) {

    const navigate = useNavigate()
    const location = useLocation()

    const [books, setBooks] = useState([])

    // FETCH BOOKS
    const fetchBooks = async () => {

        try {

            const response = await API.get(
                '/view_books/'
            )

            console.log(response.data)

            setBooks(response.data)

        }

        catch (error) {

            console.log(error)
        }
    }

    // LOAD BOOKS
    useEffect(() => {

        fetchBooks()

    }, [])

    // AVAILABLE BOOKS
    const availableBooks = books.filter(
        b => (b.Quantity || 0) > 0
    )

    const searchQuery = new URLSearchParams(location.search).get('search')?.trim().toLowerCase() || ''

    const filteredBooks = availableBooks.filter((book) => {
        const title = (book.Title || '').toString().toLowerCase()
        const author = (book.Author || '').toString().toLowerCase()
        const category = (book.Category || '').toString().toLowerCase()
        const isbn = (book.ISBN || '').toString().toLowerCase()

        return (
            title.includes(searchQuery) ||
            author.includes(searchQuery) ||
            category.includes(searchQuery) ||
            isbn.includes(searchQuery)
        )
    })

    const displayedBooks = searchQuery ? filteredBooks : availableBooks

    const pageTitle = searchQuery
        ? `Search results for "${searchQuery}"`
        : 'Available Books'

    // BORROW BOOK
    const borrowBook = async (book) => {

        try {

            const user = username || localStorage.getItem('username')

            if (!user) {
                // Not logged in, force login
                alert('Please login to borrow a book')
                navigate('/login')
                return
            }

            const borrowData = {
                Title: book.Title,
                UserId: user,
                Quantity: 1
            }

            const response = await API.post(
                '/borrow_book/',
                borrowData
            )

            console.log(response.data)

            alert('Book Borrowed Successfully')

            // REFRESH BOOKS
            fetchBooks()

        }

        catch (error) {

            console.log(error)

            if (error.response) {

                alert(
                    JSON.stringify(error.response.data)
                )

            } else {

                alert('Borrow Failed')
            }
        }
    }

    return (
        <>
            <Navbar />

            <div className="books-page">

                <h1 className="books-title">
                    {pageTitle}
                </h1>

                {availableBooks.length === 0 ? (

                    <p className="no-books">
                        No books available right now
                    </p>

                ) : displayedBooks.length === 0 ? (

                    <p className="no-books">
                        No books match "{searchQuery}". Try another title, author, category, or ISBN.
                    </p>

                ) : (

                    <div className="books-grid">

                        {displayedBooks.map((book) => (

                            <div
                                className="book-card"
                                key={book.Id}
                            >

                                {/* BOOK IMAGE */}
                                <div className="book-image-container">

                                    {(book.Image || book.image) ? (

                                        <img
                                            src={book.Image || book.image}
                                            alt={book.title}
                                            className="book-image"
                                        />

                                    ) : (

                                        <div className="no-image">
                                            No Image
                                        </div>
                                    )}

                                </div>

                                <div className="book-details">

                                    <h2>{book.Title}</h2>

                                    <p>
                                        <b>Author:</b>{' '}
                                        {book.Author}
                                    </p>

                                    <p>
                                        <b>Available Quantity:</b>{' '}
                                        {book.Quantity ?? 0}
                                    </p>

                                    <p>
                                        <b>Total Quantity:</b>{' '}
                                        {book.Total_Quantity ?? book.Quantity ?? 0}
                                    </p>

                                    <p>
                                        <b>Created:</b>{' '}
                                        {book.Created_At
                                            ? new Date(book.Created_At).toLocaleDateString()
                                            : '-'}
                                    </p>

                                    {book.Updated_At && (
                                        <p>
                                            <b>Updated:</b>{' '}
                                            {new Date(book.Updated_At).toLocaleDateString()}
                                        </p>
                                    )}

                                    <button
                                        className="borrow-btn"
                                        onClick={() =>
                                            borrowBook(book)
                                        }
                                        disabled={
                                            (book.Quantity ?? 0) <= 0
                                        }
                                    >

                                        {(book.Quantity ?? 0) > 0
                                            ? 'Borrow Book'
                                            : 'Out of Stock'}

                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>

            <Footer />
        </>
    )
}