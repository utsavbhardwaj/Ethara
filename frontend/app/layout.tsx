import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/providers';

export const metadata: Metadata = {
  title: 'FlowSphere – Team Task Manager',
  description:
    'Modern SaaS-style team task management platform. Manage projects, assign tasks, collaborate, and track progress with role-based access control.',
  keywords: ['task manager', 'project management', 'team collaboration', 'kanban', 'productivity'],
  openGraph: {
    title: 'FlowSphere – Team Task Manager',
    description: 'Modern SaaS-style team task management platform.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
