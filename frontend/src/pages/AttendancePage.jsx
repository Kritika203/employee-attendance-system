import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import API from '../api/axios'
import './AttendancePage.css'

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [filterEmployee, setFilterEmployee] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const [attRes, empRes] = await Promise.all([
        API.get(`/attendance?date=${date}${filterEmployee ? `&employeeId=${filterEmployee}` : ''}`),
        API.get('/employees')
      ])
      setAttendance(attRes.data)
      setEmployees(empRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  fetchData()
  const interval = setInterval(fetchData, 30000)
  return () => clearInterval(interval)
}, [date, filterEmployee])

  const getStatus = (empId) => {
    const record = attendance.find(a => a.employeeId?._id === empId)
    return record?.status || 'Not Marked'
  }

  const displayList = filterEmployee
    ? employees.filter(e => e._id === filterEmployee)
    : employees

  return (
    <Layout>
      <div className="attendance-page">
        <div className="page-header">
          <div>
            <h1>Attendance</h1>
            <p className="subtitle">View daily attendance records</p>
          </div>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Filter by Employee</label>
            <select value={filterEmployee} onChange={e => setFilterEmployee(e.target.value)}>
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="table-card">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {displayList.length === 0 ? (
                  <tr><td colSpan="4" className="empty">No employees found</td></tr>
                ) : (
                  displayList.map(emp => {
                    const status = getStatus(emp._id)
                    return (
                      <tr key={emp._id}>
                        <td><span className="emp-name">{emp.name}</span></td>
                        <td><span className="dept-badge">{emp.department}</span></td>
                        <td>{date}</td>
                        <td>
                          <span className={`status-badge ${status === 'Present' ? 'present' : status === 'Absent' ? 'absent' : 'unmarked'}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default AttendancePage