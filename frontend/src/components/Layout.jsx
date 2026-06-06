import { useState } from 'react'
import Sidebar from './Sidebar'
import './Layout.css'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <main className="main-content">
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
        {children}
      </main>
    </div>
  )
}

export default Layout