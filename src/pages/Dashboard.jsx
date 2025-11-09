import Sidebar from '../components/Sidebar'


export default function Dashboard({ children }) {
return (
<div className="app-shell">
<Sidebar />
<div>
<div className="header">
<div>Dashboard</div>
</div>
<div className="container">{children}</div>
</div>
</div>
)
}