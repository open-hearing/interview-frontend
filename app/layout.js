import './globals.css';

export const metadata = {
  title: 'User Portal',
  description: 'User and family details management portal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
