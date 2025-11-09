import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import Dashboard from './Dashboard'
import JobCard from '../components/JobCard'


export default function Jobs() {

const [jobs, setJobs] = useState([])
const [editing, setEditing] = useState(null)
const [loading, setLoading] = useState(true)
const [q, setQ] = useState('')
const [sort, setSort] = useState('desc') // 'asc' | 'desc'
const [debouncedQ, setDebouncedQ] = useState('')
const [confirmDeleteId, setConfirmDeleteId] = useState(null)
const [toasts, setToasts] = useState([])


const load = async () => {
setLoading(true)
const params = {
  ...(debouncedQ ? { q: debouncedQ } : {}),
  sort,
}
const { data } = await api.get('/jobs', { params })
setJobs(data)
setLoading(false)
}
useEffect(() => { load() }, [debouncedQ, sort])

// debounce search input
useEffect(() => {
  const t = setTimeout(() => setDebouncedQ(q.trim()), 300)
  return () => clearTimeout(t)
}, [q])


const onDelete = (id) => setConfirmDeleteId(id)
const performDelete = async () => {
  const id = confirmDeleteId
  if (!id) return
  await api.delete(`/jobs/${id}`)
  setJobs(jobs.filter(j => j._id !== id))
  setConfirmDeleteId(null)
  setToasts((t) => {
    const next = [...t, { id: Date.now().toString(), type: 'success', text: 'Job deleted' }]
    setTimeout(() => setToasts((curr) => curr.filter(x => x.id !== next[next.length-1].id)), 2500)
    return next
  })
}


const onEdit = (job) => setEditing(job)
const onCancel = () => setEditing(null)
const onSave = async (e) => {
e.preventDefault()
const form = new FormData(e.target)
const payload = Object.fromEntries(form)
await api.put(`/jobs/${editing._id}`, payload)
setEditing(null)
load()
setToasts((t) => {
  const next = [...t, { id: Date.now().toString(), type: 'success', text: 'Changes saved' }]
  setTimeout(() => setToasts((curr) => curr.filter(x => x.id !== next[next.length-1].id)), 2500)
  return next
})
}

useEffect(() => {
  if (editing) {
    document.body.style.overflow = 'hidden'
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }
}, [editing, onCancel])

return (
<Dashboard>
<div style={{display:'grid', gap:16}}>
<div style={{display:'grid', gap:10}}>
<div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12}}>
<h2 style={{margin:'0 0 4px 0'}}>Job Posted</h2>
</div>
<div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
  <input className="input" placeholder="Search by title or company" value={q} onChange={e=>setQ(e.target.value)} style={{maxWidth:380}} />
  <select className="select" value={sort} onChange={e=>setSort(e.target.value)} style={{width:180}}>
    <option value="desc">Newest first</option>
    <option value="asc">Oldest first</option>
  </select>
</div>
</div>
{loading ? (
<div style={{display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))'}}>
{[...Array(6)].map((_, i) => (
<div key={i} className="card" style={{display:'grid', gap:10}}>
<div className="skeleton" style={{height:18, width:'60%', borderRadius:8}} />
<div className="skeleton" style={{height:12, width:'40%', borderRadius:8}} />
<div className="skeleton" style={{height:80, width:'100%', borderRadius:10}} />
</div>
))}
</div>
) : (
jobs.length ? (
<div style={{display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))'}}>
{jobs.map(j => (
<JobCard key={j._id} job={j} onEdit={onEdit} onDelete={onDelete} />
))}
</div>
) : (
<div className="card" style={{display:'grid', gap:10, alignContent:'start'}}>
<h3 style={{margin:'0 0 4px 0'}}>No jobs yet</h3>
<div className="muted">Create your first posting to get started.</div>
<div>
<Link className="btn primary" to="/add">Post a Job</Link>
</div>
</div>
))}
{editing && (
<div className="modal-backdrop" onClick={onCancel}>
  <div className="modal" role="dialog" aria-modal="true" aria-labelledby="edit-dialog-title" onClick={(e) => e.stopPropagation()}>
    <div className="card">
      <h3 id="edit-dialog-title" style={{marginTop:0}}>Edit: {editing.title}</h3>
      <form onSubmit={onSave} style={{display:'grid', gap:10}}>
        <input name="title" className="input" defaultValue={editing.title} />
        <textarea name="description" className="textarea" defaultValue={editing.description} />
        <div className="row">
          <input name="company" className="input" defaultValue={editing.company} />
          <input name="deadline" type="date" className="input" defaultValue={editing.deadline?.slice(0,10)} />
        </div>
        <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
          <button className="btn ghost" type="button" onClick={onCancel}>Cancel</button>
          <button className="btn primary" type="submit">Save</button>
        </div>
      </form>
    </div>
  </div>
</div>
)}
{confirmDeleteId && (
  <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-delete-title" onClick={(e) => e.stopPropagation()}>
      <div className="card" style={{display:'grid', gap:12}}>
        <h3 id="confirm-delete-title" style={{marginTop:0}}>Delete job?</h3>
        <div className="muted">This action cannot be undone.</div>
        <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
          <button className="btn ghost" type="button" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
          <button className="btn danger" type="button" onClick={performDelete}>Delete</button>
        </div>
      </div>
    </div>
  </div>
)}

<div className="toast-container" aria-live="polite" aria-atomic="true">
  {toasts.map(t => (
    <div key={t.id} className={`toast ${t.type}`}>{t.text}</div>
  ))}
</div>
</div>
</Dashboard>
)
}