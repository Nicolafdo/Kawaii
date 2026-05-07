'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function TrainerDashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [user, setUser] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Material upload state
  const [selectedTrainingId, setSelectedTrainingId] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  // Feedback state
  const [feedbackTrainingId, setFeedbackTrainingId] = useState('');
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');

  const fetchData = async () => {
    try {
      const [userRes, trainingsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/trainings')
      ]);
      
      const userData = await userRes.json();
      const trainingsData = await trainingsRes.json();
      
      if (userRes.ok) setUser(userData.user);
      
      if (trainingsRes.ok && userData.user) {
        // Filter trainings assigned to THIS trainer
        const assigned = trainingsData.filter(t => t.trainerId === userData.user.id);
        setTrainings(assigned);
      } else {
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
    fetchData();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedTrainingId) return alert('Please select a training and a file');

    const formData = new FormData();
    formData.append('trainingId', selectedTrainingId);
    formData.append('description', description);
    formData.append('file', file);

    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        alert('Material uploaded successfully!');
        setFile(null); setDescription(''); setSelectedTrainingId('');
        fetchData(); // Refresh list to show new materials
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to upload material');
      }
    } catch (err) {
      alert('Error uploading material');
    }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackTrainingId) return alert('Please select a training');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainingId: feedbackTrainingId, rating, comment })
      });
      if (res.ok) {
        alert('Feedback submitted successfully!');
        setComment(''); setFeedbackTrainingId('');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit feedback');
      }
    } catch (err) {
      alert('Error submitting feedback');
    }
  };

  if (loading) return (
    <div className="flex justify-center align-center" style={{ height: '50vh' }}>
      <div className="badge trainer" style={{ fontSize: '1rem', padding: '10px 20px' }}>Loading Data...</div>
    </div>
  );

  return (
    <div>
      <div className="content-header">
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
            {activeTab === 'trainings' ? 'Assigned Trainings' : 'Trainer Dashboard'}
          </h2>
          <p className="text-muted text-sm mt-1">
            {activeTab === 'trainings' ? 'View and manage your assigned training programs.' : 'Manage your assigned training programs, upload materials, and provide feedback.'}
          </p>
        </div>
      </div>

      {(activeTab === 'overview' || activeTab === 'trainings') && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div className="stat-details">
              <h3>My Assigned Trainings</h3>
              <div className="value">{trainings.length}</div>
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'overview' || activeTab === 'trainings') && (
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginTop: '2rem' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Assigned Programs Table</h2>
          </div>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Program</th>
                  <th>Schedule</th>
                  <th>Venue</th>
                  <th>Students</th>
                </tr>
              </thead>
              <tbody>
                {trainings.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--secondary-text)' }}>
                      No programs assigned to you.
                    </td>
                  </tr>
                ) : (
                  trainings.map(t => (
                    <tr key={t.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{t.title}</div>
                        <div className="badge mt-1">{t.area}</div>
                      </td>
                      <td>{new Date(t.schedule).toLocaleString()}</td>
                      <td>{t.venue}</td>
                      <td>
                        <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary-hover)' }}>
                          {t._count?.enrollments || 0} Enrolled
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

      {activeTab === 'overview' && (
        <div className="flex" style={{ gap: '1.5rem', flexWrap: 'wrap', marginTop: '2rem' }}>
          <div className="card" style={{ flex: '1 1 400px' }}>
            <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Upload Material</h2>
              <p className="text-muted text-sm mt-1">Share documents and slides for a training.</p>
            </div>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label>Select Training</label>
                <select value={selectedTrainingId} onChange={e => setSelectedTrainingId(e.target.value)} required>
                  <option value="">-- Choose a program --</option>
                  {trainings.map(t => (
                    <option key={t.id} value={t.id}>{t.title} ({t.schedule})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Week 1 Presentation Notes" required />
              </div>
              <div className="form-group">
                <label>File Upload (PDF, PPTX, DOCX)</label>
                <input type="file" onChange={e => setFile(e.target.files[0])} required style={{ background: 'var(--bg-color)' }} />
              </div>
              <div className="mt-2">
                <button type="submit" className="w-full flex align-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '20px', height: '20px'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                  Upload Material
                </button>
              </div>
            </form>
          </div>

          <div className="card" style={{ 
            flex: '1 1 400px', 
            border: 'none', 
            borderLeft: '4px solid var(--primary-color)',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            padding: 0,
            overflow: 'hidden'
          }}>
            <div style={{ padding: '2rem 2rem 1.5rem 2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '0.5rem' }}>Submit Feedback</h2>
              <p style={{ color: 'var(--secondary-text)', fontSize: '0.95rem' }}>Provide professional assessment and feedback for your trainees.</p>
            </div>
            
            <div style={{ padding: '0 2rem 2rem 2rem' }}>
              <form onSubmit={handleFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em', 
                      color: '#64748b', 
                      marginBottom: '8px',
                      display: 'block'
                    }}>Select Training</label>
                    <select 
                      value={feedbackTrainingId} 
                      onChange={e => setFeedbackTrainingId(e.target.value)} 
                      required 
                      style={{ 
                        borderRadius: '8px', 
                        border: '1px solid #E2E8F0', 
                        padding: '0.625rem 0.75rem',
                        fontSize: '0.95rem'
                      }}
                    >
                      <option value="">-- Choose a program --</option>
                      {trainings.map(t => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em', 
                      color: '#64748b', 
                      marginBottom: '8px',
                      display: 'block'
                    }}>Rating</label>
                    <select 
                      value={rating} 
                      onChange={e => setRating(e.target.value)} 
                      required 
                      style={{ 
                        borderRadius: '8px', 
                        border: '1px solid #E2E8F0', 
                        padding: '0.625rem 0.75rem',
                        fontSize: '0.95rem'
                      }}
                    >
                      <option value="5">5 Stars - Excellent</option>
                      <option value="4">4 Stars - Very Good</option>
                      <option value="3">3 Stars - Good</option>
                      <option value="2">2 Stars - Fair</option>
                      <option value="1">1 Star - Poor</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em', 
                    color: '#64748b', 
                    marginBottom: '8px',
                    display: 'block'
                  }}>Trainee Performance Comments</label>
                  <textarea 
                    rows="4" 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                    placeholder="Share your professional observations about trainee progress and participation..." 
                    required
                    style={{ 
                      resize: 'none', 
                      borderRadius: '8px', 
                      border: '1px solid #E2E8F0', 
                      padding: '0.75rem',
                      fontSize: '0.95rem',
                      fontStyle: 'italic',
                      color: '#1e293b'
                    }}
                  ></textarea>
                </div>

                <button type="submit" className="w-full" style={{ 
                  padding: '0.875rem', 
                  borderRadius: '10px', 
                  fontWeight: 700, 
                  fontSize: '1rem',
                  backgroundColor: 'var(--primary-color)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease'
                }}>
                  Submit Performance Review
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrainerDashboard() {
  return (
    <Suspense fallback={<div>Loading Trainer Dashboard...</div>}>
      <TrainerDashboardContent />
    </Suspense>
  );
}
