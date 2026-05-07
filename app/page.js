import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
      {/* Top Navigation */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1.5rem 5%', 
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '32px', height: '32px', color: 'var(--primary-color)' }}>
            <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
          </svg>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
            <span style={{ color: 'var(--primary-color)' }}>Amex</span> 
            <span style={{ color: '#000000', fontSize: '0.9rem', fontWeight: 500, marginLeft: '0.4rem' }}>Training Management System</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/login" style={{ fontWeight: 500, color: 'var(--secondary-text)' }}>
            Sign in
          </Link>
          <Link href="/register">
            <button style={{ padding: '0.5rem 1rem' }}>Get Started</button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1 }}>
        <section style={{ 
          padding: '6rem 5%', 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom, #ffffff, var(--primary-light))',
          minHeight: '70vh'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="badge mt-2 mb-4" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-hover)', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              The next generation of training management
            </div>
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
              lineHeight: 1.1, 
              fontWeight: 800, 
              color: 'var(--text-color)',
              marginBottom: '1.5rem',
              letterSpacing: '-0.025em'
            }}>
              Empower your workforce with <span style={{ color: 'var(--primary-color)' }}>Amex Training</span>
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'var(--secondary-text)', 
              marginBottom: '2.5rem',
              maxWidth: '600px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.6
            }}>
              A centralized platform to manage, enroll, and track employee training programs. Designed for modern teams at Amex Corporation.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register">
                <button style={{ padding: '0.875rem 2rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Create an account
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </Link>
              <Link href="/login">
                <button className="secondary" style={{ padding: '0.875rem 2rem', fontSize: '1.125rem' }}>
                  Login to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section style={{ padding: '5rem 5%', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Everything you need to scale learning</h2>
              <p className="text-muted mt-1">Built specifically for Admins, Trainers, and Trainees.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="card" style={{ border: 'none', background: 'var(--bg-color)', textAlign: 'center', padding: '2.5rem 2rem' }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '30px', height: '30px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Program Management</h3>
                <p className="text-muted text-sm">Admins can effortlessly schedule and oversee training programs across various departments and venues.</p>
              </div>

              <div className="card" style={{ border: 'none', background: 'var(--bg-color)', textAlign: 'center', padding: '2.5rem 2rem' }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--success-bg)', color: 'var(--success)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '30px', height: '30px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Resource Sharing</h3>
                <p className="text-muted text-sm">Trainers can easily upload and distribute presentation materials and documents to their enrolled trainees.</p>
              </div>

              <div className="card" style={{ border: 'none', background: 'var(--bg-color)', textAlign: 'center', padding: '2.5rem 2rem' }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--warning-bg)', color: '#d97706', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '30px', height: '30px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Continuous Feedback</h3>
                <p className="text-muted text-sm">Collect actionable insights with post-training feedback systems, allowing both trainers and trainees to improve.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ 
        borderTop: '1px solid var(--border-color)', 
        padding: '2rem 5%', 
        backgroundColor: 'white',
        color: 'var(--secondary-text)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px', color: 'var(--primary-color)' }}>
            <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
          </svg>
          <span style={{ fontWeight: 600 }}>
            <span style={{ color: 'var(--primary-color)' }}>Amex</span> 
            <span style={{ color: '#000000', fontSize: '0.8rem', fontWeight: 500, marginLeft: '0.3rem' }}>Training Management System</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
          <Link href="/privacy-policy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms & Conditions</Link>
        </div>
        <div style={{ fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} Amex Corporation. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
