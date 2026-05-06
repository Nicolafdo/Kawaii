import './globals.css';

export const metadata = {
  title: 'Amex Training Management System',
  description: 'Digital training management for Amex Corporation',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
