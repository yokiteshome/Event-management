'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isDashboardPage = pathname?.startsWith('/dashboard');
  const isAdminPage = pathname?.startsWith('/admin');
  
  if (isDashboardPage || isAdminPage) {
    return null;
  }
  
  return <Footer />;
}

