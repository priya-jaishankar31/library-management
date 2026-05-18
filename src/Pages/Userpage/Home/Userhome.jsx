import React from 'react'
import './Userhome.css'
import Logo from '../../../assets/Logo.jpeg'
import userlogo from '../../../assets/userlogo.jpg'
import Footer from '../../../Component/Footer/Footer'
import { useNavigate } from 'react-router-dom'

export default function Userhome({ username }) {

    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/");
    };

    return (
        <>
            <nav className='nav-container'>

                <div className='image-container'>
                    <img src={Logo} alt="Logo" className='logo' />
                </div>

                <div className='title-container'>
                    <h1>LIBRARY MANAGEMENT SYSTEM</h1>
                </div>

                <div className="logout-container">

                    <span className='btn-user'>
                        Welcome - {username}
                    </span>
                    

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>

            <div className="userhome-container">

                <img
                    src={userlogo}
                    alt="User Logo"
                    className="home-image"
                />

                <div className="overlay">

                    <div className="overlay-content">

                        <h1>
                            Welcome to the Library Management System
                        </h1>

                        <p>
                            Discover books, manage borrowings,
                            and explore your library easily.
                        </p>

                        <div className="button-group">

                            <button className="btn" onClick={() => navigate("/books")}>
                                Explore Books
                            </button>

                            <a
                                href="/borrowed"
                                className="btn secondary-btn"
                            >
                                My Borrowed Books
                            </a>

                        </div>

                        <input
                            type="text"
                            placeholder="Search for books..."
                            className="search-bar"
                        />

                    </div>

                </div>

            </div>

            <Footer />
        </>
    )
}