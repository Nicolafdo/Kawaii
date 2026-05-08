'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [trainings, setTrainings] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalTrainings: 0, totalEnrollments: 0 });
  const [loading, setLoading] = useState(true);
  const [editingTraining, setEditingTraining] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  // Form states
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('');
  const [trainerId, setTrainerId] = useState('');
  const [schedule, setSchedule] = useState('');
  const [venue, setVenue] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [trainingsRes, usersRes, statsRes] = await Promise.all([
        fetch('/api/trainings'),
        fetch('/api/users'),
        fetch('/api/stats')
      ]);
      
      if (trainingsRes.ok) setTrainings(await trainingsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      
      const feedbackRes = await fetch('/api/feedback');
      if (feedbackRes.ok) setFeedbacks(await feedbackRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const trainers = users.filter(u => u.role === 'TRAINER');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingTraining ? `/api/trainings/${editingTraining.id}` : '/api/trainings';
    const method = editingTraining ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, area, trainerId: parseInt(trainerId), schedule, venue })
      });
      if (res.ok) {
        alert(editingTraining ? 'Updated!' : 'Created!');
        resetForm();
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Operation failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const resetForm = () => {
    setTitle(''); setArea(''); setTrainerId(''); setSchedule(''); setVenue('');
    setEditingTraining(null);
  };

  const handleEdit = (t) => {
    setEditingTraining(t);
    setTitle(t.title);
    setArea(t.area);
    setTrainerId(t.trainerId.toString());
    setSchedule(t.schedule);
    setVenue(t.venue);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    try {
      const res = await fetch(`/api/trainings/${id}`, { 
        method: 'DELETE',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        // Success feedback
        console.log('Training deleted successfully');
        fetchData(); // Refresh all stats and lists
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete program');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Network error while deleting');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      alert('Error');
    }
  };

  if (loading) return (
    <div className="flex justify-center align-center" style={{ height: '50vh' }}>
      <div className="badge admin" style={{ fontSize: '1rem', padding: '10px 20px' }}>Loading...</div>
    </div>
  );

  return (
    <div>
      <div className="content-header">
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
            {activeTab === 'overview' ? 'Dashboard Overview' : 'User Management'}
          </h2>
          <p className="text-muted text-sm mt-1">
            {activeTab === 'overview' ? 'Manage your training programs and view statistics.' : activeTab === 'users' ? 'Manage system users and their roles.' : 'View and manage all training feedback.'}
          </p>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg></div>
              <div className="stat-details">
                <h3>Programs</h3>
                <div className="value">{stats.totalTrainings}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg></div>
              <div className="stat-details">
                <h3>Users</h3>
                <div className="value">{stats.totalUsers}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg></div>
              <div className="stat-details">
                <h3>Enrollments</h3>
                <div className="value">{stats.totalEnrollments}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{editingTraining ? 'Update Program' : 'New Training Program'}</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: '1 1 300px' }}>
                  <label>Title</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Training Title" />
                </div>
                <div className="form-group" style={{ flex: '1 1 200px' }}>
                  <label>Area</label>
                  <input value={area} onChange={e => setArea(e.target.value)} required placeholder="e.g. Sales" />
                </div>
              </div>
              <div className="flex" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: '1 1 200px' }}>
                  <label>Trainer</label>
                  <select value={trainerId} onChange={e => setTrainerId(e.target.value)} required>
                    <option value="">-- Select --</option>
                    {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ flex: '1 1 200px' }}>
                  <label>Schedule</label>
                  <input type="datetime-local" value={schedule} onChange={e => setSchedule(e.target.value)} required />
                </div>
                <div className="form-group" style={{ flex: '1 1 200px' }}>
                  <label>Venue</label>
                  <input value={venue} onChange={e => setVenue(e.target.value)} required placeholder="Room/Link" />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit">{editingTraining ? 'Save Changes' : 'Create Program'}</button>
                {editingTraining && <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>}
              </div>
            </form>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>All Programs</h2>
            </div>
            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Program</th>
                    <th>Trainer</th>
                    <th>Schedule</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {trainings.map(t => (
                    <tr key={t.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{t.title}</div>
                        <div className="badge mt-1">{t.area}</div>
                      </td>
                      <td>{t.trainer?.name}</td>
                      <td>{new Date(t.schedule).toLocaleString()}<br/><small className="text-muted">{t.venue}</small></td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="flex justify-end gap-2">
                          <button type="button" className="icon-btn" onClick={() => handleEdit(t)} title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '18px', height: '18px', pointerEvents: 'none'}}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                          </button>
                          <button 
                            type="button"
                            className="icon-btn danger-icon" 
                            onClick={(e) => {
                              handleDelete(t.id);
                            }} 
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '18px', height: '18px', pointerEvents: 'none'}}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>System Users</h2>
          </div>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="flex align-center gap-3">
                        <div className="user-avatar">{u.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{u.name}</div>
                          <div className="text-xs text-muted">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${u.role.toLowerCase()}`}>{u.role}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        type="button" 
                        className="icon-btn danger-icon" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteUser(u.id);
                        }} 
                        title="Delete User"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '18px', height: '18px'}}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Feedback Management</h2>
              <p className="text-muted text-sm mt-1">View all feedback submitted by trainers and trainees.</p>
            </div>
            <div className="badge admin">{feedbacks.length} Total</div>
          </div>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Submitter</th>
                  <th>Program</th>
                  <th>Rating</th>
                  <th>Comments</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--secondary-text)' }}>No feedback submitted yet.</td>
                  </tr>
                ) : (
                  feedbacks.map(f => (
                    <tr key={f.id}>
                      <td style={{ verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 600 }}>{f.user?.name}</div>
                        <div className="text-xs text-muted">{new Date(f.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td style={{ verticalAlign: 'top' }}>{f.training?.title}</td>
                      <td style={{ verticalAlign: 'top' }}>
                        <div className="flex align-center gap-1" style={{ color: '#eab308' }}>
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < f.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} style={{ width: '16px', height: '16px' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
                          ))}
                        </div>
                      </td>
                      <td style={{ verticalAlign: 'top', maxWidth: '300px' }}>
                        <div className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{f.comment}</div>
                      </td>
                      <td style={{ verticalAlign: 'top' }}>
                        <span className={`badge ${f.isFromTrainer ? 'trainer' : 'trainee'}`}>
                          {f.isFromTrainer ? 'Trainer' : 'Trainee'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
