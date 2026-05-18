import React, { useEffect, useState } from 'react'
import './Books.css'
import Navbar from "../../../Component/Navbar/Navbar"
import Footer from '../../../Component/Footer/Footer'

export default function Books({ username }) {

    const [books, setBooks] = useState([])

    // Load books from localStorage
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("books")) || []
        setBooks(data)
    }, [])

    // Available books only
    const availableBooks = books.filter(b => b.status === "Available")

    // Borrow book
    const borrowBook = (id) => {

        const updatedBooks = books.map(book => {

            if (book.id === id) {

                return {
                    ...book,
                    status: "Borrowed",
                    borrowedBy: username,
                    returned: false,
                    dueDate: new Date(Date.now() + 7 * 86400000)
                        .toISOString()
                        .split("T")[0]
                }
            }

            return book
        })

        setBooks(updatedBooks)
        localStorage.setItem("books", JSON.stringify(updatedBooks))
    }

    return (
        <>
        <Navbar />
        <div className="books-page">

            <h1 className="books-title">Available Books</h1>

            {availableBooks.length === 0 ? (
                <p className="no-books">No books available right now</p>
            ) : (
                <div className="books-grid">

                    {availableBooks.map(book => (
                        <div className="book-card" key={book.id}>

                            <h2>{book.title}</h2>
                            <p><b>Author:</b> {book.author}</p>

                            <p className="status available">
                                {book.status}
                            </p>

                            <button
                                className="borrow-btn"
                                onClick={() => borrowBook(book.id)}
                            >
                                Borrow Book
                            </button>

                        </div>
                    ))}

                </div>
            )}

        </div>
        <Footer />
        </>
    )
}