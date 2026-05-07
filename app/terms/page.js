import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', padding: '4rem 5%' }}>
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem' }}>
        <Link href="/" className="flex align-center gap-2 mb-8 text-sm" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </Link>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.025em' }}>Terms & Conditions</h1>
        
        <div style={{ lineHeight: '1.7', color: 'var(--secondary-text)' }}>
          <p className="mb-4">Last Updated: May 7, 2026</p>
          
          <h2 className="mt-8 mb-4" style={{ color: 'var(--text-color)', fontSize: '1.5rem' }}>1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using Amex Training Management System (TMS), you accept and agree to be bound by the terms and provision of this agreement.
          </p>
          
          <h2 className="mt-8 mb-4" style={{ color: 'var(--text-color)', fontSize: '1.5rem' }}>2. Use of License</h2>
          <p className="mb-4">
            Permission is granted to temporarily use the materials (information or software) on Amex TMS for personal, non-commercial transitory viewing only.
          </p>
          
          <h2 className="mt-8 mb-4" style={{ color: 'var(--text-color)', fontSize: '1.5rem' }}>3. Disclaimer</h2>
          <p className="mb-4">
            The materials on Amex TMS are provided on an 'as is' basis. Amex Corporation makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          
          <h2 className="mt-8 mb-4" style={{ color: 'var(--text-color)', fontSize: '1.5rem' }}>4. Limitations</h2>
          <p className="mb-4">
            In no event shall Amex Corporation or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Amex TMS.
          </p>
          
          <h2 className="mt-8 mb-4" style={{ color: 'var(--text-color)', fontSize: '1.5rem' }}>5. Revisions and Errata</h2>
          <p className="mb-4">
            The materials appearing on Amex TMS could include technical, typographical, or photographic errors. Amex Corporation does not warrant that any of the materials on its website are accurate, complete or current.
          </p>
          
          <h2 className="mt-8 mb-4" style={{ color: 'var(--text-color)', fontSize: '1.5rem' }}>6. Governing Law</h2>
          <p className="mb-4">
            Any claim relating to Amex TMS shall be governed by the laws of the jurisdiction of Amex Corporation's headquarters without regard to its conflict of law provisions.
          </p>
        </div>
      </div>
    </div>
  );
}
