import { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import api from '../api'
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

// light, friendly palette
const PIE_COLORS = ['#93c5fd', '#86efac', '#fde68a']

export default function CustomerAnalysis() {
  const [pie, setPie] = useState([])
  const [bar, setBar] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await api.get('/jobs/stats')
    setPie(data.pie || [])
    setBar(data.bar || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  return (
    <Dashboard>
      <div className="row">
        <div className="card">
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <h3 style={{marginTop:0}}>Audience Split (by Company)</h3>
          </div>
          <div style={{width:'100%', height:280, minWidth:0}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2} label>
                  {pie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background:'#ffffff', border:'1px solid rgba(15,23,42,0.12)', borderRadius:8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {loading && <div className="muted">Loading…</div>}
          {!loading && pie.length === 0 && <div className="muted">No data.</div>}
        </div>
        <div className="card">
          <h3 style={{marginTop:0}}>Applications by Month</h3>
          <div style={{width:'100%', height:280, minWidth:0}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bar}>
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#bfdbfe" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
                <XAxis dataKey="month" tick={{ fill:'var(--muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'var(--muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:'#ffffff', border:'1px solid rgba(15,23,42,0.12)', borderRadius:8 }} />
                <Bar dataKey="count" fill="url(#barFill)" radius={[6,6,0,0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {loading && <div className="muted">Loading…</div>}
          {!loading && bar.length === 0 && <div className="muted">No data.</div>}
        </div>
      </div>
    </Dashboard>
  )
}