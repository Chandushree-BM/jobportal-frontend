import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
const { logout, user } = useAuth()
return (
<aside className="sidebar">
<div className="brand">Dashboard</div>
<div className="badge" style={{marginBottom:12}}>{user?.name}</div>
<nav className="nav">
<NavLink to="/jobs" className={({isActive})=> isActive ? 'active' : ''}>Job Posted</NavLink>
<NavLink to="/add">Job Posting</NavLink>
<NavLink to="/analysis">Customer Analysis</NavLink>
<NavLink to="/profile">Profile</NavLink>
<a onClick={logout} style={{cursor:'pointer'}}>Logout</a>
</nav>
</aside>
)
}