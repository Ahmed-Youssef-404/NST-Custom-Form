import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import StarsBackground from '@/layouts/StarsBackground';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'sonner';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <StarsBackground />
      <Navbar />
      <Toaster />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
