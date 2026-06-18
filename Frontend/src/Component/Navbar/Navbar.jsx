import React from 'react'
import './Navbar.css'
import Logo from '../../assets/Logo.jpeg'

export default function Navbar() {
  return (
    <>
    <nav className='nav-container'>

        <div className='image-container'>
            <img src={Logo} alt="Logo" className='logo' />
        </div> 

        <div className='title-container'>
            <h1> LIBRARY MANAGEMENT SYSTEM </h1>
        </div>
        
    </nav>
    </>
  )
}
