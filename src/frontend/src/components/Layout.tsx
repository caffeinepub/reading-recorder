import { Outlet, Link, useRouterState } from '@tanstack/react-router';
import { Mic, PlayCircle, Settings } from 'lucide-react';

export default function Layout() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Reading Recorder</h1>
            <nav className="flex gap-2">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentPath === '/'
                    ? 'bg-recording text-recording-foreground'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                <Mic className="w-5 h-5" />
                <span className="font-medium">Record</span>
              </Link>
              <Link
                to="/playback"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentPath === '/playback'
                    ? 'bg-playback text-playback-foreground'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                <PlayCircle className="w-5 h-5" />
                <span className="font-medium">Playback</span>
              </Link>
              <Link
                to="/settings"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentPath === '/settings'
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} · Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'reading-recorder'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
