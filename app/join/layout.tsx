import { AuthGuard } from '@/app/providers/AuthGuard';

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
