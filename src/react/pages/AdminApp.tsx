import { Suspense, lazy, useEffect, Component } from 'react';
import { AppProviders } from '../providers/AppProviders';
import { AppLayout } from '../layouts/AppLayout';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from '@lib/router';
import { SITE_TITLE } from '../../lib/site';

const Dashboard = lazy(() => import('./Dashboard'));
const SamplePage = lazy(() => import('./SamplePage'));
const Settings = lazy(() => import('./Settings'));

// ─── Title Sync ───────────────────────────────────────────────
// Auto-update document title berdasarkan route
function TitleSync() {
  const location = useLocation();

  useEffect(() => {
    const p = location.pathname;
    let label = 'Dashboard';
    if (p.startsWith('/sample')) label = 'Sample Page';
    else if (p.startsWith('/settings')) label = 'Settings';

    document.title = `${label} | ${SITE_TITLE}`;
  }, [location.pathname]);

  return null;
}

// ─── Admin App ────────────────────────────────────────────────
export default function AdminApp() {
  return (
    <AppProviders>
      {/* Semua route admin di bawah /admin via basename */}
      <BrowserRouter basename="/admin">
        <AppLayout>
          <ErrorBoundary>
            <Suspense fallback={<div style={{ padding: 16 }}>Loading...</div>}>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="sample" element={<SamplePage />} />
                <Route path="settings" element={<Settings />} />
                {/* Catch-all: redirect ke dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <TitleSync />
            </Suspense>
          </ErrorBoundary>
        </AppLayout>
      </BrowserRouter>
    </AppProviders>
  );
}

// ─── Error Boundary ───────────────────────────────────────────
class ErrorBoundary extends Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  componentDidCatch(error: any, info: any) {
    console.error('Route error', error, info);
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError)
      return <div style={{ padding: 16 }}>Failed to load module. Please refresh the page.</div>;
    return this.props.children;
  }
}
