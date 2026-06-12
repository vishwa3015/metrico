import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard, FlaskConical, FileBarChart, Users,
  Cpu, SlidersHorizontal, History, Settings, LogOut, Loader2
} from 'lucide-react'
import { useState } from 'react'

export type Screen =
  | 'dashboard' | 'results' | 'reports' | 'users'
  | 'devices' | 'thresholds' | 'audit' | 'account'

const ALL_ITEMS: { id: Screen; label: string; Icon: any }[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'results', label: 'Test Results', Icon: FlaskConical },
  { id: 'reports', label: 'Reports', Icon: FileBarChart },
  { id: 'users', label: 'Users', Icon: Users },
  { id: 'devices', label: 'Devices', Icon: Cpu },
  { id: 'thresholds', label: 'Threshold Settings', Icon: SlidersHorizontal },
  { id: 'audit', label: 'Audit History', Icon: History },
  { id: 'account', label: 'Account / Settings', Icon: Settings },
]

const SUPERVISOR_HIDDEN: Screen[] = ['users', 'thresholds']

export function Sidebar({
  active,
  onNavigate,
}: {
  active: Screen
  onNavigate: (s: Screen) => void
}) {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
  }

  const navItems =
    user?.role === 'Supervisor'
      ? ALL_ITEMS.filter((i) => !SUPERVISOR_HIDDEN.includes(i.id))
      : ALL_ITEMS

  const initials = user
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : '??'

  const fullName = user ? `${user.first_name} ${user.last_name}` : '—'
  const roleLabel = user?.role ?? ''

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-sky-600 text-white shadow-sm">
          <FlaskConical className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="text-slate-900 tracking-tight">Metrico</div>
          <div className="text-xs text-slate-500">Compliance Console</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600"}`} />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-teal-500 text-white flex items-center justify-center text-xs font-medium shrink-0">
            {initials}
          </div>
          <div className="flex-1 leading-tight">
            <div className="text-sm text-slate-800">{fullName}</div>
            <div className="text-xs text-slate-500">{roleLabel}</div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Sign out"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-50 shrink-0"
          >
            {isLoggingOut
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <LogOut className="h-4 w-4" />
            }
          </button>
        </div>
      </div>
    </aside>
  );
}
