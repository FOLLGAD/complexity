import { SessionProvider } from '@/components/sessions';
import { Suspense } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MainContent } from '../components/MainContent';

function Home() {
  return (
    <div className='flex h-svh'>
      <Sidebar />

      <MainContent />
    </div>
  );
}

export default function Main() {
  return (
    <Suspense fallback={<div></div>}>
      <SessionProvider>
        <Home />
      </SessionProvider>
    </Suspense>
  );
}
