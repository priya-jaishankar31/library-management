import { useState, useEffect } from 'react'
import './AdminUsers.css'
import Navbar from '../../../Component/Navbar/Navbar'
import Footer from '../../../Component/Footer/Footer'
import { useNavigate } from 'react-router-dom'
import API from "../../../Api/api";

export default function AdminUsers() {

    const navigate = useNavigate()

    // Redirect to login if not authenticated as admin
    useEffect(() => {
        const role = localStorage.getItem('role')
        if (role !== 'admin') {
            navigate('/login')
        }
    }, [navigate])

    const [users, setUsers] = useState([])
    const [newUserName, setNewUserName] = useState('')
    const [newUserEmail, setNewUserEmail] = useState('')
    const [newUserPassword, setNewUserPassword] = useState('')

    const fetchUsers = async () => {
        try {
            const response = await API.get('/users/')
            setUsers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const createUserId = name => {
        const base = name
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '')

        const padded = base.length >= 4 ? base.slice(0, 10) : base.padEnd(4, 'user')
        const suffix = Math.floor(100 + Math.random() * 900)

        return `${padded}${suffix}`
    }

    // ADD USER
    const addUser = async () => {

        if (
            !newUserName ||
            !newUserEmail ||
            !newUserPassword
        ) {
            alert('Please enter all user details')
            return
        }

        const emailLower = newUserEmail.toLowerCase()

        const userExists = users.find(
            u => u.Email?.toLowerCase() === emailLower
        )

        if (userExists) {
            alert('User already exists')
            return
        }

        const userData = {
            Name: newUserName,
            UserId: createUserId(newUserName),
            Email: newUserEmail,
            Password: newUserPassword,
            Role: 'user'
        }

        try {
            await API.post('/users/', userData)
            alert('User Added Successfully')
            fetchUsers()
            setNewUserName('')
            setNewUserEmail('')
            setNewUserPassword('')
        } catch (error) {
            console.log(error)
            if (error.response) {
                alert(JSON.stringify(error.response.data))
            } else {
                alert('Server Error')
            }
        }
    }

    // DELETE USER
    const deleteUser = async (userId) => {

        if (
            window.confirm(
                'Are you sure you want to delete this user?'
            )
        ) {

            try {
                await API.delete(`/user_delete/${encodeURIComponent(userId)}`)
                alert('User Deleted')
                fetchUsers()
            } catch (error) {
                console.log(error)
                alert('Delete Failed')
            }
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('username')
        localStorage.removeItem('isAuthenticated')
        navigate('/login')
    }

    return (
        <>
            <Navbar />

            <div className="admin-users-container">

                {/* Header */}
                <div className="users-header">
                    <button 
                        className="back-btn"
                        onClick={() => navigate('/admin-home')}
                    >
                        ← Back to Dashboard
                    </button>

                    <h1>User Management</h1>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

                {/* Add User Section */}
                <div className="add-user-section">
                    <h2>Add New User</h2>
                    
                    <div className="add-user-form">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={newUserName}
                            onChange={(e) =>
                                setNewUserName(e.target.value)
                            }
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={newUserEmail}
                            onChange={(e) =>
                                setNewUserEmail(e.target.value)
                            }
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={newUserPassword}
                            onChange={(e) =>
                                setNewUserPassword(e.target.value)
                            }
                        />

                        <button 
                            className="add-btn"
                            onClick={addUser}
                        >
                            Add User
                        </button>
                    </div>
                </div>

                {/* Users List */}
                <div className="users-list-section">
                    <h2>All Users ({users.length})</h2>

                    {users.length === 0 ? (
                        <p className="no-users">No users found</p>
                    ) : (
                        <div className="table-wrapper">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>User ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.Id}>
                                            <td>{user.Id}</td>
                                            <td>{user.Name}</td>
                                            <td>{user.Email}</td>
                                            <td>
                                                <span className={`role-badge ${user.Role}`}>
                                                    {user.Role}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        deleteUser(user.Id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>

            <Footer />
        </>
    )
}
