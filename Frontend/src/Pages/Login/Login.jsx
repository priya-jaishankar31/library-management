import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import Navbar from '../../Component/Navbar/Navbar'
import Footer from '../../Component/Footer/Footer'
import API from '../../Api/api'

export default function Login({ setUsername }) {

  const navigate = useNavigate()

  const [UserId, setUser] = useState('')
  const [Password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  const handleLogin = async (e) => {

  e.preventDefault()

  try {
    console.log('entere')

    const response = await API.post(
      '/login/',
      {
        UserId: UserId,
        Password: Password
      }
    )

    console.log(response.data)

    // Admin Login
    if (response.data.Role === 'admin') {
      localStorage.setItem('role', 'admin')
      localStorage.setItem('isAuthenticated', 'true')
      navigate('/admin-home')
    }

    // User Login
    else if (response.data.Role === 'user') {
      setUsername(response.data.UserId)
      localStorage.setItem('username', response.data.UserId)
      localStorage.setItem('role', 'user')
      localStorage.setItem('isAuthenticated', 'true')
      navigate('/user-home')
    }

    else {
      console.log('response', response)
      alert(response)
    }

    setError('')
    setToastVisible(false)
  }

  catch (error) {
    console.log(error)

    let message = 'Server Error'

    if (error.response && error.response.data) {
      const data = error.response.data
      if (typeof data === 'string') {
        message = data
      }
      else if (data.detail) {
        message = data.detail
      }
      else {
        message = JSON.stringify(data)
      }
    }

    setError(message)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
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
            placeholder="Enter Username or User ID"
            value={UserId}
            onChange={(e) =>
              setUser(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={Password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Login
          </button>

          {toastVisible && (
            <div className="login-toast">
              {error}
            </div>
          )}

          <div>
            <p>
              New Registration?
              <a href="/signup">
                Register Here
              </a>
            </p>
          </div>

        </form>

      </div>

      <Footer />
    </>
  )
}