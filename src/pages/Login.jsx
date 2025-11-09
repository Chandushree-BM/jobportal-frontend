import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function Login() {
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
      const res = await api.post("/auth/login", { email, password })

      // ✅ store token
      localStorage.setItem("token", res.data.token)

      nav('/jobs')  // <-- redirect
    } catch (error) {
      setErr(error.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <h2>Sign in</h2>
        <div className="muted">Welcome back! Please enter your details.</div>

        {err && (
          <div className="badge" role="alert">
            ⚠ {err}
          </div>
        )}

        <form onSubmit={handle} className="form-grid">

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              className="input"
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              className="input"
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="btn ghost"
              onClick={() => setShowPwd(!showPwd)}
            >
              {showPwd ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            className="btn primary"
            type="submit"
            disabled={loading || !email || !password}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="muted">
          No account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  )
}
