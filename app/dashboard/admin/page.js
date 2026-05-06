'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [trainings, setTrainings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('');
  const [trainerId, setTrainerId] = useState('');
  const [schedule, setSchedule] = useState('');
  const [venue, setVenue] = useState('');

  const fetchTrainings = async () => {
    try {
      const res = await fetch('/api/trainings');
      const data = await res.json();
      if (res.ok) {
        setTrainings(data);
      } else {
        console.error('API error:', data);
        setTrainings([]);
      }
    } catch (err) {
      console.error(err);
      setTrainings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
    setUsers([{ id: 2, name: 'John Trainer' }]); 
  }, []);

  const handleCreateTraining = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/trainings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, area, trainerId, schedule, venue })
      });
      if (res.ok) {
        alert('Training created successfully!');
        fetchTrainings();
        // Reset form
        setTitle(''); setArea(''); setTrainerId(''); setSchedule(''); setVenue('');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create training');
      }
    } catch (err) {
      alert('Error creating training');
    }
  };

  if (loading) return (
    <div className="flex justify-center align-center" style={{ height: '50vh' }}>
      <div className="badge admin" style={{ fontSize: '1rem', padding: '10px 20px' }}>Loading Data...</div>
    </div>
  );

  return (
    <div>
      <div className="content-header">
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Dashboard Overview</h2>
          <p className="text-muted text-sm mt-1">Manage training programs and system activities.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          </div>
          <div className="stat-details">
            <h3>Total Trainings</h3>
            <div className="value">{trainings.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
          <div className="stat-details">
            <h3>Active Users</h3>
            <div className="value">--</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--warning-bg)', color: '#d97706' }}>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
          </div>
          <div className="stat-details">
            <h3>Enrollments</h3>
            <div className="value">{trainings.reduce((acc, t) => acc + (t._count?.enrollments || 0), 0)}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Create New Training</h2>
          <p className="text-muted text-sm mt-1">Schedule a new training program for employees.</p>
        </div>
        <form onSubmit={handleCreateTraining}>
          <div className="flex" style={{ gap: '1.5rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: '1 1 calc(50% - 0.75rem)' }}>
              <label>Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Enter training title" />
            </div>
            <div className="form-group" style={{ flex: '1 1 calc(50% - 0.75rem)' }}>
              <label>Training Area</label>
              <input value={area} onChange={e => setArea(e.target.value)} required placeholder="e.g., Technology, Leadership" />
            </div>
          </div>
          
          <div className="flex" style={{ gap: '1.5rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: '1 1 calc(33.333% - 1rem)' }}>
              <label>Trainer ID</label>
              <input type="number" value={trainerId} onChange={e => setTrainerId(e.target.value)} placeholder="e.g. 2" required />
            </div>
            <div className="form-group" style={{ flex: '1 1 calc(33.333% - 1rem)' }}>
              <label>Schedule</label>
              <input value={schedule} onChange={e => setSchedule(e.target.value)} placeholder="e.g. 2026-06-01 10:00 AM" required />
            </div>
            <div className="form-group" style={{ flex: '1 1 calc(33.333% - 1rem)' }}>
              <label>Venue</label>
              <input value={venue} onChange={e => setVenue(e.target.value)} required placeholder="e.g. Room A" />
            </div>
          </div>
          
          <div className="mt-2 flex justify-between align-center">
            <button type="submit" className="flex align-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '20px', height: '20px'}}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create Training
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>All Training Programs</h2>
            <p className="text-muted text-sm mt-1">A list of all scheduled programs in the system.</p>
          </div>
          <div style={{ width: '250px' }}>
            <input type="search" placeholder="Search trainings..." style={{ marginBottom: 0 }} />
          </div>
        </div>
        
        {trainings.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--secondary-text)' }}>
            No trainings available. Create one above.
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Title & Area</th>
                  <th>Trainer</th>
                  <th>Schedule & Venue</th>
                  <th>Enrolled</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainings.map(t => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--text-color)' }}>{t.title}</div>
                      <div className="badge mt-1">{t.area}</div>
                    </td>
                    <td>
                      <div className="flex align-center gap-2">
                        <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                          {(t.trainer?.name || 'T').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm">{t.trainer?.name || `Trainer #${t.trainerId}`}</span>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '14px', height: '14px', color: 'var(--secondary-text)'}}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                        {t.schedule}
                      </div>
                      <div className="text-sm" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--secondary-text)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '14px', height: '14px'}}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                        {t.venue}
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary-hover)' }}>
                        {t._count?.enrollments || 0}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex justify-end gap-2">
                        <button className="icon-btn" title="Edit" onClick={() => alert('Edit functionality mock')}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '18px', height: '18px'}}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                        <button className="icon-btn danger-icon" title="Delete" onClick={() => alert('Delete functionality mock')}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '18px', height: '18px'}}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
