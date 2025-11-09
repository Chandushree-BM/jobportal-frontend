import { useState } from 'react'
import Dashboard from './Dashboard'
import api from '../api'


export default function AddJob() {
  const [toasts, setToasts] = useState([])
  const submit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const payload = Object.fromEntries(form)
    await api.post('/jobs', payload)
    e.target.reset()
    setToasts((t) => {
      const next = [...t, { id: Date.now().toString(), type: 'success', text: 'Job posted successfully' }]
      setTimeout(() => setToasts((curr) => curr.filter(x => x.id !== next[next.length-1].id)), 2500)
      return next
    })
  }


  return (
    <Dashboard>
      <div className="card">
        <h2 style={{marginTop:0}}>Post a Job</h2>
        <form onSubmit={submit} style={{display:'grid', gap:10}}>
          <input className="input" name="title" placeholder="Job Title" required />
          <textarea className="textarea" name="description" placeholder="Job Description" required />
          <div className="row">
            <input className="input" name="company" placeholder="Company Name" required />
            <input className="input" type="date" name="deadline" required />
          </div>
          <button className="btn primary" type="submit">Submit</button>
        </form>
      </div>
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>{t.text}</div>
        ))}
      </div>
    </Dashboard>
  )
}