'use client';
import { useState, useEffect } from 'react';

export default function TraineeDashboard() {
  const [trainings, setTrainings] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Trainee Dashboard</h2>
          <p className="text-muted text-sm mt-1">Browse available trainings, manage your enrollments, and leave feedback.</p>
        </div>
      </div>

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

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Available Trainings</h2>
            <p className="text-muted text-sm mt-1">Explore and enroll in new programs.</p>
          </div>
        </div>
        
        {trainings.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--secondary-text)' }}>
            No trainings available at the moment.
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Program Info</th>
                  <th>Trainer</th>
                  <th>Schedule & Venue</th>
                  <th style={{ textAlign: 'right' }}>Status / Action</th>
                </tr>
              </thead>
              <tbody>
                {trainings.map(t => {
                  const isEnrolled = enrollments.includes(t.id);
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
                        <div className="text-sm" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '14px', height: '14px', color: 'var(--secondary-text)'}}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                          {t.schedule}
                        </div>
                        <div className="text-sm" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--secondary-text)' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '14px', height: '14px'}}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                          {t.venue}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {isEnrolled ? (
                          <div className="badge success" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '14px', height: '14px', marginRight: '4px'}}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            Enrolled
                          </div>
                        ) : (
                          <button onClick={() => handleEnroll(t.id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Enroll Now</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
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
    </div>
  );
}
