'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function TraineeDashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [trainings, setTrainings] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Feedback state
  const [feedbackTrainingId, setFeedbackTrainingId] = useState('');
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');

  const fetchData = async () => {
    try {
      const [trainingsRes, enrollmentsRes] = await Promise.all([
        fetch('/api/trainings'),
        fetch('/api/enrollments')
      ]);
      const trainingsData = await trainingsRes.json();
      const enrollmentsData = await enrollmentsRes.json();
      
      if (trainingsRes.ok) {
        setTrainings(trainingsData);
      } else {
        setTrainings([]);
      }
      
      if (enrollmentsRes.ok) {
        setEnrollments(enrollmentsData.map(e => e.trainingId)); // Store enrolled training IDs
      } else {
        setEnrollments([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Close dropdown when clicking outside
    const handleClickOutside = () => setOpenDropdown(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleEnroll = async (trainingId) => {
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainingId })
      });
      if (res.ok) {
        alert('Enrolled successfully!');
        fetchData(); // Refresh enrollments
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to enroll');
      }
    } catch (err) {
      alert('Error during enrollment');
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
      <div className="badge trainee" style={{ fontSize: '1rem', padding: '10px 20px' }}>Loading Data...</div>
    </div>
  );

  const enrolledTrainingsList = trainings.filter(t => enrollments.includes(t.id));

  return (
    <div>
      <div className="content-header">
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
            {activeTab === 'trainings' ? 'Available Programs' : 'Trainee Dashboard'}
          </h2>
          <p className="text-muted text-sm mt-1">
            {activeTab === 'trainings' ? 'Browse and enroll in available training programs.' : 'Browse available trainings, manage your enrollments, and leave feedback.'}
          </p>
        </div>
      </div>

      {(activeTab === 'overview' || activeTab === 'trainings') && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            </div>
            <div className="stat-details">
              <h3>My Enrollments</h3>
              <div className="value">{enrolledTrainingsList.length}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div className="stat-details">
              <h3>Available Programs</h3>
              <div className="value">{trainings.length - enrolledTrainingsList.length}</div>
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'overview' || activeTab === 'trainings') && (
        <div className="card" style={{ padding: 0, overflow: 'visible', marginTop: '2rem' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Course Catalog</h2>
              <p className="text-muted text-sm mt-1">Explore programs and access learning resources.</p>
            </div>
          </div>
          
          {trainings.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--secondary-text)' }}>
              No trainings available at the moment.
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', borderRadius: 0, overflow: 'visible' }}>
              <table style={{ overflow: 'visible' }}>
                <thead>
                  <tr>
                    <th>Program Info</th>
                    <th>Trainer</th>
                    <th>Schedule & Venue</th>
                    <th style={{ textAlign: 'right' }}>Resources & Enrollment</th>
                  </tr>
                </thead>
                <tbody>
                  {trainings.map(t => {
                    const isEnrolled = enrollments.includes(t.id);
                    const materialCount = t.materials?.length || 0;
                    
                    return (
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
                            <span className="text-sm">{t.trainer?.name || 'Assigned Trainer'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="text-sm flex align-center gap-1 mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '14px', height: '14px', color: 'var(--secondary-text)'}}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                            {new Date(t.schedule).toLocaleString()}
                          </div>
                          <div className="text-sm flex align-center gap-1 color-muted">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '14px', height: '14px'}}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                            {t.venue}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="flex justify-end align-center gap-2" style={{ position: 'relative' }}>
                            {isEnrolled ? (
                              <div className="badge success" style={{ background: 'var(--success-bg)', color: 'var(--success)', whiteSpace: 'nowrap' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '14px', height: '14px', marginRight: '4px'}}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                Enrolled
                              </div>
                            ) : (
                              <button type="button" onClick={() => handleEnroll(t.id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Enroll Now</button>
                            )}

                            {isEnrolled && (
                              <div style={{ position: 'relative' }}>
                                <button 
                                  type="button" 
                                  className="btn-secondary flex align-center gap-1"
                                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdown(openDropdown === t.id ? null : t.id);
                                  }}
                                >
                                  Resources ({materialCount})
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '12px', height: '12px'}}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                  </svg>
                                </button>
                                
                                {openDropdown === t.id && (
                                  <div 
                                    className="dropdown-menu card" 
                                    style={{ 
                                      position: 'absolute', 
                                      top: '100%', 
                                      right: 0, 
                                      zIndex: 100, 
                                      minWidth: '200px', 
                                      marginTop: '5px',
                                      padding: '0.5rem',
                                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                      textAlign: 'left'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {materialCount > 0 ? (
                                      t.materials.map(m => (
                                        <a 
                                          key={m.id} 
                                          href={m.filePath} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="flex align-center gap-2 p-2 rounded hover-bg-light text-sm"
                                          style={{ textDecoration: 'none', color: 'var(--text-color)', display: 'block' }}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '14px', height: '14px', color: 'var(--primary-color)'}}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                          </svg>
                                          {m.description}
                                        </a>
                                      ))
                                    ) : (
                                      <div className="p-2 text-sm text-muted">No files yet</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'overview' && enrolledTrainingsList.length > 0 && (
        <div className="card" style={{ maxWidth: '600px', marginTop: '2rem' }}>
          <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Course Feedback</h2>
            <p className="text-muted text-sm mt-1">Provide feedback for trainings you have attended.</p>
          </div>
          <form onSubmit={handleFeedback}>
            <div className="flex" style={{ gap: '1rem', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1 1 200px' }}>
                <label>Select Enrolled Training</label>
                <select value={feedbackTrainingId} onChange={e => setFeedbackTrainingId(e.target.value)} required>
                  <option value="">-- Choose a program --</option>
                  {enrolledTrainingsList.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ width: '120px' }}>
                <label>Rating</label>
                <select value={rating} onChange={e => setRating(e.target.value)} required>
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Comments</label>
              <textarea 
                rows="3" 
                value={comment} 
                onChange={e => setComment(e.target.value)} 
                placeholder="How was the training? Share your thoughts..." 
                required
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>
            <div className="mt-2">
              <button type="submit" className="flex align-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '20px', height: '20px'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function TraineeDashboard() {
  return (
    <Suspense fallback={<div>Loading Trainee Dashboard...</div>}>
      <TraineeDashboardContent />
    </Suspense>
  );
}
