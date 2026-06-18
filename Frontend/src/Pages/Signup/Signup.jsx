import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Signup.css'
import API from '../../Api/api'
import Navbar from '../../Component/Navbar/Navbar'
import Footer from '../../Component/Footer/Footer'

export default function Signup() {

  const navigate = useNavigate()

  const [Name, setUsername] = useState('')
  const [Email, setEmail] = useState('')
  const [UserId, setUserid] = useState('')  
  const [Password, setPassword] = useState('')
  const [Role, setRole] = useState('user')

  const handleSignup = async (e) => {

  e.preventDefault()


  const userData = {
  
    Name: Name,
    UserId: UserId,
    Email: Email,
    Password: Password,
    Role: Role
  }

  try {

    const response = await API.post(
      '/users/',
      userData
    )

    console.log(response.data)

    alert('Signup Successful')

    navigate('/login')

  }

  catch (error) {

  console.log(error)

  if (error.response) {

    console.log(error.response.data)

    alert(
      JSON.stringify(error.response.data)
    )

  }

  else {

    alert('Server Error')
  }
}
}
  return (
    <>
    
    <Navbar />  
    <div className="signup-container">

      <form
        className="signup-form"
        onSubmit={handleSignup}
      >

        <h1>Signup</h1>

        <input
          type="text"
          placeholder="Enter Username"
          value={Name}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={Email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Enter User ID"
          value={UserId}
          onChange={(e) =>
            setUserid(e.target.value)
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

        <select
        className='select-option'
          value={Role}
          onChange={(e) =>
            setRole(e.target.value)
          }
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">
          Signup
        </button>

      </form>

    </div>
    <Footer />
    </>
  )
}