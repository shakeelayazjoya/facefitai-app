import { router } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { EmptyState } from './EmptyState';
import { LoadingSpinner } from './LoadingSpinner';
import { ScreenWrapper } from './ScreenWrapper';
import { useAuthStore } from '@/store/authStore';
interface Props { children: ReactNode; adminOnly?: boolean }
export function ProtectedRoute({ children, adminOnly }: Props) { const user = useAuthStore((s) => s.user); const hydrated = useAuthStore((s) => s.isHydrated); useEffect(() => { if (hydrated && !user) router.replace('/(auth)/login'); }, [hydrated, user]); if (!hydrated) return <ScreenWrapper><LoadingSpinner /></ScreenWrapper>; if (!user) return null; if (adminOnly && user.role !== 'admin') return <ScreenWrapper><EmptyState title="Admin only" message="Access denied." /></ScreenWrapper>; return <>{children}</>; }
