import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default function Root() {
  const user = getCurrentUser();
  if (user) redirect(process.env.NEXT_PUBLIC_REDIRECT_URL ?? '/dashboard');
  redirect('/login');
}
