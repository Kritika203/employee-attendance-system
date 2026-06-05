import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import API from '../api/axios'
import './DashboardPage.css'

const DashboardPage = () => {
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        const [empRes, attRes] = await Promise.all([
          API.get('/employees'),
          API.get(`/attendance?date=${today}`)
        ])
        const total = empRes.data.length
        const present = attRes.data.filter(a => a.status === 'Present').length
        const absent = attRes.data.filter(a => a.status === 'Absent').length
        const notMarked = Math.max(0, total - present - absent)
        setStats({ total, present, absent, notMarked })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <Layout>
      <div className="dashboard">
        <div className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p className="date-text">{today}</p>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">👥</div>
              <div className="stat-info">
                <p className="stat-label">Total Employees</p>
                <p className="stat-value">{stats.total}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon present">✅</div>
              <div className="stat-info">
                <p className="stat-label">Present Today</p>
                <p className="stat-value">{stats.present}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon absent">❌</div>
              <div className="stat-info">
                <p className="stat-label">Absent Today</p>
                <p className="stat-value">{stats.absent}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon unmarked">⏳</div>
              <div className="stat-info">
                <p className="stat-label">Not Marked</p>
                <p className="stat-value">{stats.notMarked ?? 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default DashboardPage