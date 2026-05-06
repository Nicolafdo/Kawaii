'use client';
import { useState, useEffect } from 'react';

export default function TrainerDashboard() {
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
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Trainer Dashboard</h2>
          <p className="text-muted text-sm mt-1">Manage your assigned training programs, upload materials, and provide feedback.</p>
        </div>
      </div>

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
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--warning-bg)', color: '#d97706' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          </div>
          <div className="stat-details">
            <h3>Pending Feedback</h3>
            <div className="value">--</div>
          </div>
        </div>
      </div>

      <div className="flex" style={{ gap: '1.5rem', flexWrap: 'wrap' }}>
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
                onChange={e => setComment(e.target.value)} 
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
    </div>
  );
}
