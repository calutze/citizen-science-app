import Navbar from '@/app/ui/navbar';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div>
        <Navbar />
        <Suspense>
          <div>{children}</div>
        </Suspense>
      </div>
    );
}