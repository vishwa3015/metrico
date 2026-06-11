import { type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ROUTES } from '../router/routes';
import { useAuthStore } from '../store/authStore';
import { Screen, Sidebar } from '../components/common/SideBar';
import { TopBar } from '../components/common/TopBar';

const titles: Record<Screen, { title: string; crumbs: string[] }> = {
  dashboard:  { title: 'Dashboard',             crumbs: ['Workspace', 'Dashboard'] },
  results:    { title: 'Test Results',          crumbs: ['Workspace', 'Test Results'] },
  reports:    { title: 'Reports',               crumbs: ['Workspace', 'Reports'] },
  users:      { title: 'Users',                 crumbs: ['Workspace', 'Users'] },
  devices:    { title: 'Devices',               crumbs: ['Workspace', 'Devices'] },
  thresholds: { title: 'Threshold Settings',    crumbs: ['Workspace', 'Settings', 'Thresholds'] },
  audit:      { title: 'Audit History',         crumbs: ['Workspace', 'Audit'] },
  account:    { title: 'Account & Preferences', crumbs: ['Workspace', 'Settings', 'Account'] },
}

const routeToScreen: Record<string, Screen> = {
  [ROUTES.HOME]:    'dashboard',
  [ROUTES.RESULTS]: 'results',
}

export function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuthStore(state => state.logout)

  // Derive active screen from URL — no useState needed
  const screen: Screen = routeToScreen[location.pathname] ?? 'dashboard'
  const meta = titles[screen]

  const handleNavigate = (s: Screen) => {
    navigate(s === 'dashboard' ? ROUTES.HOME : `/${s}`)
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 antialiased">
      <Sidebar active={screen} onNavigate={handleNavigate} onLogout={logout} />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <TopBar title={meta.title} crumbs={meta.crumbs} />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}