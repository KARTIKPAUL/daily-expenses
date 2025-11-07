import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Expense Tracker - Track Your Daily Expenses',
  description: 'A full-stack expense tracking application built with Next.js and MongoDB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}