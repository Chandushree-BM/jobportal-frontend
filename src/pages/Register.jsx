import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')

  const handle = async (e) => {
    e.preventDefault()
    setErr('')
    try { await register(name, email, password); nav('/jobs') } catch (e) { setErr(e.response?.data?.message || 'Registration failed') }
  }

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <h2 style={{marginTop:0}}>Create account</h2>
        {err && <div className="badge" style={{borderColor:'rgba(239,68,68,0.5)', marginBottom:10}}>⚠ {err}</div>}
        <form onSubmit={handle} style={{display:'grid', gap:10}}>
          <input className="input" placeholder="Name" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" placeholder="Email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn primary" type="submit">Register</button>
        </form>
        <div style={{marginTop:10, color:'var(--muted)'}}>Have an account? <Link to="/login">Login</Link></div>
      </div>
    </div>
  )
}
