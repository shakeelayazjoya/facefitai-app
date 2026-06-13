import React, { type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from './ErrorState';
import { ScreenWrapper } from './ScreenWrapper';
import { monitoring } from '@/services/monitoring';

interface State { hasError: boolean }
export class ErrorBoundary extends React.Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(): State { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo): void { monitoring.captureException(error, { component_stack: info.componentStack ?? null }); }
  render() { if (this.state.hasError) return <ScreenWrapper centered padded><ErrorState message="Restart and try again." onRetry={() => this.setState({ hasError: false })} /></ScreenWrapper>; return this.props.children; }
}
