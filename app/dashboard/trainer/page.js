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

          <div className="card" style={{ flex: '1 1 400px' }}>
            <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Submit Feedback</h2>
              <p className="text-muted text-sm mt-1">Provide post-session feedback on trainees.</p>
            </div>
            <form onSubmit={handleFeedback}>
              <div className="flex" style={{ gap: '1rem' }}>
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Select Training</label>
                  <select value={feedbackTrainingId} onChange={e => setFeedbackTrainingId(e.target.value)} required>
                    <option value="">-- Choose a program --</option>
                    {trainings.map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Rating (1-5)</label>
                  <select value={rating} onChange={e => setRating(e.target.value)} required>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Comments</label>
                <textarea 
                  rows="4" 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)} 
                  placeholder="Share your observations..." 
                  required
                  style={{ resize: 'vertical' }}
                ></textarea>
              </div>
              <div className="mt-2">
                <button type="submit" className="w-full flex align-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '20px', height: '20px'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                  Submit Feedback
                </button>
              </div>
            </form>
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
