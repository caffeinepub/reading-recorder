import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import Layout from './components/Layout';
import RecordingPage from './pages/RecordingPage';
import PlaybackPage from './pages/PlaybackPage';
import SettingsPage from './pages/SettingsPage';

const rootRoute = createRootRoute({
  component: Layout,
});

const recordingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: RecordingPage,
});

const playbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/playback',
  component: PlaybackPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([recordingRoute, playbackRoute, settingsRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
