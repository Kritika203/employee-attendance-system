import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import API from '../api/axios'
import './EmployeesPage.css'

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editEmployee, setEditEmployee] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', department: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchEmployees = async () => {
    try {
      const res = await API.get('/employees')
      setEmployees(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEmployees() }, [])

  const openAdd = () => {
    setEditEmployee(null)
    setForm({ name: '', phone: '', department: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (emp) => {
    setEditEmployee(emp)
    setForm({ name: emp.name, phone: emp.phone, department: emp.department })
    setError('')
    setShowModal(true)
  }

  const openDelete = (emp) => {
    setDeleteTarget(emp)
    setShowDeleteModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (editEmployee) {
        await API.put(`/employees/${editEmployee._id}`, form)
      } else {
        await API.post('/employees', form)
      }
      setShowModal(false)
      fetchEmployees()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await API.delete(`/employees/${deleteTarget._id}`)
      setShowDeleteModal(false)
      setDeleteTarget(null)
      fetchEmployees()
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Layout>
      <div className="employees-page">
        <div className="page-header">
          <div>
            <h1>Employees</h1>
            <p className="subtitle">{employees.length} total employees</p>
          </div>
          <button className="btn-primary" onClick={openAdd}>+ Add Employee</button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="table-card">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Employee Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr><td colSpan="5" className="empty">No employees found</td></tr>
                ) : (
                  employees.map(emp => (
                    <tr key={emp._id}>
                      <td><span className="emp-name">{emp.name}</span></td>
                      <td>{emp.phone}</td>
                      <td><span className="dept-badge">{emp.department}</span></td>
                      <td><span className="code-badge">{emp.employeeCode}</span></td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-edit" onClick={() => openEdit(emp)}>Edit</button>
                          <button className="btn-delete" onClick={() => openDelete(emp)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  placeholder="e.g. Engineering"
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editEmployee ? 'Update' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Employee</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>✕</button>
            </div>
            <p className="delete-msg">
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn-delete-confirm" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default EmployeesPage