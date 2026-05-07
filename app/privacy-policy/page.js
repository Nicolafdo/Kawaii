import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', padding: '4rem 5%' }}>
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem' }}>
        <Link href="/" className="flex align-center gap-2 mb-8 text-sm" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </Link>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.025em' }}>Privacy Policy</h1>
        
        <div style={{ lineHeight: '1.7', color: 'var(--secondary-text)' }}>
          <p className="mb-4">Last Updated: May 7, 2026</p>
          
          <h2 className="mt-8 mb-4" style={{ color: 'var(--text-color)', fontSize: '1.5rem' }}>1. Introduction</h2>
          <p className="mb-4">
            Welcome to Amex Training Management System (TMS). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
          </p>
          
          <h2 className="mt-8 mb-4" style={{ color: 'var(--text-color)', fontSize: '1.5rem' }}>2. Data We Collect</h2>
          <p className="mb-4">
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="mb-4" style={{ paddingLeft: '1.5rem' }}>
            <li>Identity Data: includes name and role.</li>
            <li>Contact Data: includes email address.</li>
            <li>Technical Data: includes IP address, login data, browser type and version.</li>
            <li>Usage Data: includes information about how you use our website and services.</li>
          </ul>
          
          <h2 className="mt-8 mb-4" style={{ color: 'var(--text-color)', fontSize: '1.5rem' }}>3. How We Use Your Data</h2>
          <p className="mb-4">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="mb-4" style={{ paddingLeft: '1.5rem' }}>
            <li>To register you as a new user.</li>
            <li>To manage your enrollment in training programs.</li>
            <li>To facilitate feedback between trainers and trainees.</li>
            <li>To improve our website and services.</li>
          </ul>
          
          <h2 className="mt-8 mb-4" style={{ color: 'var(--text-color)', fontSize: '1.5rem' }}>4. Data Security</h2>
          <p className="mb-4">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
          </p>
          
          <h2 className="mt-8 mb-4" style={{ color: 'var(--text-color)', fontSize: '1.5rem' }}>5. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@amex-tms.com.
          </p>
        </div>
      </div>
    </div>
  );
}
