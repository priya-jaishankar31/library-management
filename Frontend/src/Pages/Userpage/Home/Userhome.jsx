import React, { useEffect, useState, useRef } from 'react'
import './Userhome.css'
import Logo from '../../../assets/Logo.jpeg'
import userlogo from '../../../assets/userlogo.jpg'
import Footer from '../../../Component/Footer/Footer'
import { useNavigate, Link } from 'react-router-dom'
import API from '../../../Api/api'

export default function Userhome({ username }) {

    const navigate = useNavigate();
    const dropdownRef = useRef(null)

    const [storedUsername, setStoredUsername] = useState(username)
    const [showDropdown, setShowDropdown] = useState(false)
    const [userDetails, setUserDetails] = useState({
        email: '',
        name: '',
        userId: ''
    })

    useEffect(() => {
        const role = localStorage.getItem('role')
        const user = localStorage.getItem('username')
        if (role !== 'user') {
            navigate('/login')
            return
        }
        if (!username && user) setStoredUsername(user)
        
        // Fetch user details
        fetchUserDetails(user || username)
    }, [navigate, username])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const fetchUserDetails = async (userId) => {
        try {
            const response = await API.get('/users/')
            const currentUser = response.data.find(user => user.UserId === userId)
            if (currentUser) {
                setUserDetails({
                    email: currentUser.Email,
                    name: currentUser.Name,
                    userId: currentUser.UserId
                })
            }
        } catch (error) {
            console.log('Error fetching user details:', error)
        }
    }

    const [searchQuery, setSearchQuery] = useState('')

    const handleSearchSubmit = (event) => {
        event.preventDefault()

        const query = searchQuery.trim()

        if (query) {
            navigate(`/books?search=${encodeURIComponent(query)}`)
        } else {
            navigate('/books')
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('role')
        localStorage.removeItem('username')
        localStorage.removeItem('isAuthenticated')
        setShowDropdown(false)
        navigate('/login')
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

                <div className="profile-container" ref={dropdownRef}>
                    <div className="profile-menu">
                        <button 
                            className="profile-icon-btn"
                            onClick={() => setShowDropdown(!showDropdown)}
                            title="Profile Menu"
                        >
                            <div className="profile-icon">
                                {storedUsername?.charAt(0).toUpperCase()}
                            </div>
                        </button>

                        {showDropdown && (
                            <div className="dropdown-menu">
                                <div className="dropdown-header">
                                    <div className="user-avatar">
                                        {storedUsername?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="user-info-header">
                                        <p className="user-name">{userDetails.name || storedUsername}</p>
                                        <p className="user-id-header">@{userDetails.userId || storedUsername}</p>
                                    </div>
                                </div>

                                <div className="dropdown-divider"></div>

                                <div className="dropdown-content">
                                    <div className="detail-item">
                                        <span className="detail-label">User ID</span>
                                        <span className="detail-value">{userDetails.userId || storedUsername}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Email</span>
                                        <span className="detail-value">{userDetails.email || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Username</span>
                                        <span className="detail-value">{userDetails.name || storedUsername}</span>
                                    </div>
                                </div>

                                <div className="dropdown-divider"></div>

                                <button 
                                    className="logout-btn-dropdown"
                                    onClick={handleLogout}
                                >
                                    <span>🚪</span> Logout
                                </button>
                            </div>
                        )}
                    </div>
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

                            <Link
                                to="/borrowed"
                                className="btn secondary-btn"
                            >
                                My Borrowed Books
                            </Link>

                            <Link to="/return-books" className="btn secondary-btn">
                                Return Books
                            </Link>
                        </div>

                        <form className="search-form" onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                placeholder="Search for books..."
                                className="search-bar"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="search-btn">
                                Search
                            </button>
                        </form>

                    </div>

                </div>

            </div>

            <Footer />
        </>
    )
}
