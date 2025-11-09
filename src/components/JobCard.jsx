export default function JobCard({ job, onEdit, onDelete })
 {
const deadline = new Date(job.deadline).toLocaleDateString()

return (
 <div className="card" style={{display:'grid', gap:8}}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3 style={{margin:0}}>{job.title}</h3>
            <div style={{display:'flex', gap:8}}>
              <button className="btn" onClick={() => onEdit(job)}>Edit</button>
              <button className="btn danger" onClick={() => onDelete(job._id)}>Delete</button>
            </div>
    </div>
    <div className="muted">{job.company} • <span className="badge">Last date: {deadline}</span></div>
    <p style={{margin:0, whiteSpace:'pre-wrap'}}>{job.description}</p>
</div>
)
}