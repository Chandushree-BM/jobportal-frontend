import Dashboard from './Dashboard'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Profile(){
  const { user, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  return (
    <Dashboard>
      <div className="card" style={{display:'grid', gap:16}}>
        <div style={{display:'flex', alignItems:'center', gap:16}}>
          <div className="avatar">{(user?.name||'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}</div>
          <div>
            <h2 style={{margin:'0 0 4px 0'}}>{user?.name}</h2>
            <div className="muted">{user?.email}</div>
          </div>
        </div>
        <div style={{display:'grid', gap:8}}>
          <div style={{display:'grid', gridTemplateColumns:'160px 1fr', gap:8}}>
            <div className="muted">Display name</div>
            <div>
              {editing ? (
                <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
              ) : (
                <span>{user?.name}</span>
              )}
            </div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'160px 1fr', gap:8}}>
            <div className="muted">Email</div>
            <div>{user?.email}</div>
          </div>
        </div>
        <div style={{display:'flex', gap:8}}>
          {!editing ? (
            <button className="btn" onClick={()=>{ setEditing(true); setName(user?.name || '') }}>Edit</button>
          ) : (
            <>
              <button className="btn primary" disabled={saving} onClick={async()=>{
                setErr(''); setMsg(''); setSaving(true)
                try { await updateProfile({ name }); setMsg('Saved'); setEditing(false) } catch(e){ setErr(e.response?.data?.message || 'Save failed') } finally { setSaving(false) }
              }}>{saving ? 'Saving…' : 'Save'}</button>
              <button className="btn ghost" disabled={saving} onClick={()=>{ setEditing(false); setName(user?.name || '') }}>Cancel</button>
            </>
          )}
          {msg && <div className="badge">{msg}</div>}
          {err && <div className="badge" style={{borderColor:'rgba(239,68,68,0.5)'}}>⚠ {err}</div>}
        </div>
      </div>
    </Dashboard>
  )
}