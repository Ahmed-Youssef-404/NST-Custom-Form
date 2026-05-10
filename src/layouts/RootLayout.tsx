import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import StarsBackground from '@/layouts/StarsBackground';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <StarsBackground />
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
