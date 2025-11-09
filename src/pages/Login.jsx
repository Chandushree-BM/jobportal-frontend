import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      await login(email, password)
      nav('/jobs')
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <h2 style={{ marginTop: 0, marginBottom: 4 }}>Sign in</h2>
        <div className="muted" style={{ marginBottom: 16 }}>Welcome back! Please enter your details.</div>
        {err && (
          <div className="badge" role="alert" aria-live="assertive" style={{ borderColor: 'rgba(239,68,68,0.5)', marginBottom: 10 }}>
            ⚠ {err}
          </div>
        )}
        <form onSubmit={handle} className="form-grid">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!err}
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="btn ghost"
                onClick={() => setShowPwd((v) => !v)}
                style={{ padding: '6px 10px', fontWeight: 500 }}
              >
                {showPwd ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="password"
              className="input"
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!err}
            />
          </div>

          <button className="btn primary" type="submit" disabled={loading || !email || !password}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <div className="muted" style={{ marginTop: 10 }}>
          No account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  )
}

