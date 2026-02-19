import type { Metadata, Viewport } from 'next';
import './globals.css';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Nexus';

export const metadata: Metadata = {
  title: {
    default:  `${APP_NAME} — Secure Access`,
    template: `%s | ${APP_NAME}`,
  },
  description: 'Next-generation secure authentication.',
  robots:      'noindex, nofollow',  // auth pages shouldn't be indexed
};

export const viewport: Viewport = {
  themeColor: '#050c12',
  width:      'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
