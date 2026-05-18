import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import Navbar from '../../Component/Navbar/Navbar'
import Footer from '../../Component/Footer/Footer'

export default function Login({ setUsername }) {

  const navigate = useNavigate()

  const [username, setUser] = useState('')

  const [password, setPassword] = useState('')

  // GET USERS FROM LOCALSTORAGE
  const [users, setUsers] = useState([])

  useEffect(() => {
    const savedUsers = localStorage.getItem('libraryUsers')
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    } else {
      // Default users if none exist in localStorage
      const defaultUsers = [
        { id: 1, name: 'Shyam', email: 'shyam@gmail.com', password: 'shyam123' },
        { id: 2, name: 'Priya', email: 'priya@gmail.com', password: 'priya123' },
        { id: 3, name: 'Rahul', email: 'rahul@gmail.com', password: 'rahul123' }
      ]
      setUsers(defaultUsers)
      localStorage.setItem('libraryUsers', JSON.stringify(defaultUsers))
    }
  }, [])

  const handleLogin = (e) => {

    e.preventDefault()

    // Admin Login
    if (
      username === 'admin' &&
      password === 'admin123'
    ) {

      navigate('/admin-home')
    }

    // User Login - Check from localStorage
    else {
      const loggedInUser = users.find(u => u.name === username && u.password === password)
      
      if (loggedInUser) {
        setUsername(loggedInUser.name)
        navigate('/user-home')
      } else {
        alert('Invalid Username or Password')
      }
    }
  }

  return (
    <>
      <Navbar />

      <div className="login-container">

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <h1>Login</h1>

          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) =>
              setUser(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>

      <Footer />
    </>
  )
}