import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <>
    <footer className = "footer-container">
        <div className='footer-box'>
         <h3>Information Links</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>    
        </div>
        <div className='footer-box'>
            <h3>Other Links</h3>
            <ul>
                <li><a href="/help">Help Center</a></li>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/support">Support</a></li>
                <li><a href="/Refund-Policy">Refund Policy</a></li>
            </ul>
        </div>
        <div className='footer-box'>
            <h3>Follow Us</h3>
            <ul>
                <li><a href="https://www.facebook.com/LibraryManagementSystem">Facebook</a></li>
                <li><a href="https://twitter.com/LibraryManagement">Twitter</a></li>
                <li><a href="https://www.instagram.com/LibraryManagement">Instagram</a></li>
            </ul>
        </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Library Management System. All rights reserved.</p>
      </div>
    </footer>
    </>
  )
}
