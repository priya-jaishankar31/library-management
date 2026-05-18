import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'
import Navbar from '../../Component/Navbar/Navbar'
import Footer from '../../Component/Footer/Footer'

export default function Home() {

  const [selectedBook, setSelectedBook] = useState(null)

  const books = [
    {
      id: 1,
      title: 'Atomic Habits',
      author: 'James Clear',
      image:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794',
      description:
        'A practical guide to building good habits and breaking bad ones.',
      fullDescription:
        'Atomic Habits explains how tiny changes can create remarkable results over time.'
    },

    {
      id: 2,
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      image:
        'https://images.unsplash.com/photo-1521587760476-6c12a4b040da',
      description:
        'A philosophical novel about following your dreams.',
      fullDescription:
        'The Alchemist follows Santiago on his journey to discover his destiny.'
    },

    {
      id: 3,
      title: 'Rich Dad Poor Dad',
      author: 'Robert Kiyosaki',
      image:
        'https://images.unsplash.com/photo-1516979187457-637abb4f9353',
      description:
        'A book about financial education and wealth mindset.',
      fullDescription:
        'Rich Dad Poor Dad teaches important financial lessons about money and investing.'
    }
  ]

  const authors = [
    {
      id: 1,
      name: 'J.K. Rowling',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      description:
        'British author famous for the Harry Potter series.'
    },

    {
      id: 2,
      name: 'George Orwell',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      description:
        'English novelist known for 1984 and Animal Farm.'
    }
  ]

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {

    e.preventDefault()

    if (
      name.trim() === '' ||
      email.trim() === '' ||
      message.trim() === ''
    ) {

      alert('Please fill all fields')

      return
    }

    alert(`Thank you ${name}, your message has been submitted!`)

    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <>
    <Navbar />
    <div className="home-container">
      {/* Hero Section */}

        <section className="hero">

        {/* Overlay */}

        <div className="overlay">

          {/* Links On Overlay */}

          <div className="overlay-links">

            <a href="#">Home</a>

            <a href="#explore">Explore Books</a>

            <a href="#about">About Us</a>

            <a href="#authors">About Authors</a>

            <a href="#contact">Contact Us</a>

          </div>

          {/* Hero Content */}

          <div className="hero-content">

            <h1>
              Welcome To <br />
              Digital Library
            </h1>

            <p>
              Discover thousands of books from famous authors
              and explore new worlds.
            </p>

            {/* Login Buttons */}

            <div className="login-buttons">

              <a className="login-btn" href="/login">
                 Login/Signup
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* Explore Books */}

      <section className="books-section" id="explore">

        <h2>Explore Books</h2>

        <div className="books-container">

          {books.map((book) => (

            <div className="book-card" key={book.id}>

              <img src={book.image} alt={book.title} />

              <h3>{book.title}</h3>

              <p>
                <strong>Author:</strong> {book.author}
              </p>

              <p>{book.description}</p>


            </div>
          ))}

        </div>

      </section>

      {/* Modal */}

      {selectedBook && (

        <div className="modal-overlay">

          <div className="modal">

            <img
              src={selectedBook.image}
              alt={selectedBook.title}
            />

            <h2>{selectedBook.title}</h2>

            <p>
              <strong>Author:</strong>
              {selectedBook.author}
            </p>

            <p>{selectedBook.fullDescription}</p>

            <button
              onClick={() => setSelectedBook(null)}
            >
              Close
            </button>

          </div>

        </div>
      )}

      {/* About Us */}

      <section className="about-section" id="about">

        <h2>About Us</h2>

        <p>
          Our library management system helps users discover,
          explore, and manage books easily.
        </p>

        <p>
          Our mission is to encourage reading and make
          knowledge accessible to everyone.
        </p>

      </section>

      {/* Contact Us */}

      <section className="contact-section" id="contact">

        <h2>Contact Us</h2>

        <form
          className="contact-form"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <textarea
            placeholder="Enter Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>

          <button type="submit">
            Submit
          </button>

        </form>

      </section>

      {/* Authors */}

      <section className="authors-section" id="authors">

        <h2>About Authors</h2>

        <div className="authors-container">

          {authors.map((author) => (

            <div className="author-card" key={author.id}>

              <img
                src={author.image}
                alt={author.name}
              />

              <h3>{author.name}</h3>

              <p>{author.description}</p>

            </div>
          ))}

        </div>

      </section>

    </div>
    <Footer />
    </>
  )
}