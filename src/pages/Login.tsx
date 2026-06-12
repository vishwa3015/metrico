import { FlaskConical, ShieldCheck, Loader2, AlertCircle } from 'lucide-react'
import { Button, Input, Label } from '../components/ui'
import { useLogin } from '@/hooks/useLogin'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/router/routes'

export function Login() {
  const navigate = useNavigate()
  const { form, errors, isLoading, handleChange, handleSubmit } = useLogin()

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-teal-50/40 flex">
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-teal-600 via-teal-700 to-sky-800 text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 -left-24 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
            <FlaskConical className="h-5 w-5" />
          </div>
          <div className="tracking-tight">Metrico</div>
        </div>
        <div className="relative">
          <h2 className="text-3xl tracking-tight max-w-md">
            Compliance-ready review for every HOCl & pH test.
          </h2>
          <p className="mt-3 text-teal-50/80 max-w-md text-sm">
            Review device-synced results, manage thresholds, and export audit-grade reports for inspectors — all in one workspace.
          </p>
          <div className="mt-8 flex items-center gap-2 text-sm text-teal-50/80">
            <ShieldCheck className="h-4 w-4" /> 21 CFR Part 11 aligned · SOC 2 Type II
          </div>
        </div>
        <div className="relative text-xs text-teal-100/70">© 2026 Metrico Diagnostics, Inc.</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 lg:hidden mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-sky-600 text-white">
              <FlaskConical className="h-5 w-5" />
            </div>
            <div className="tracking-tight text-slate-900">Metrico</div>
          </div>

          <h1 className="text-slate-900 tracking-tight text-2xl">Sign in to Metrico</h1>
          <p className="text-sm text-slate-500 mt-1">Use your workspace credentials to continue.</p>

          {errors.general && (
            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange('email')}
                disabled={isLoading}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.NOT_FOUND)}
                  className="text-xs text-teal-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange('password')}
                disabled={isLoading}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-400"
              />
              Keep me signed in on this device
            </label>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-b from-teal-500 to-teal-600 hover:from-teal-500 hover:to-teal-700 border-0 disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <p className="mt-8 text-xs text-slate-500">
            By signing in you agree to Metrico's compliance & data retention terms.
          </p>
        </div>
      </div>
    </div>
  );
}
