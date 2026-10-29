import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [isSlow, setIsSlow] = useState(false);

  // The free backend sleeps when idle and can take up to a minute to wake.
  // If the guest request is slow, explain why instead of looking frozen.
  useEffect(() => {
    if (!isGuestLoading) {
      setIsSlow(false);
      return;
    }
    const timer = setTimeout(() => setIsSlow(true), 3000);
    return () => clearTimeout(timer);
  }, [isGuestLoading]);

  const handleGuest = async () => {
    setError(null);
    setIsGuestLoading(true);
    try {
      const response = await authService.guest();
      login(response.token, response.username, `${response.username}@guest.trellolite.local`);
      navigate('/dashboard', { state: { isNewUser: true } });
    } catch {
      setError("Couldn't start the guest demo. Please try again in a moment.");
    } finally {
      setIsGuestLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await authService.login({ email, password });
      login(response.token, response.username, email);
      navigate('/dashboard');
    } catch (err: any) {
      // /auth/login returns a plain string body on 401 (e.g. "Invalid credentials"),
      // unlike /auth/register which returns { message } — handle both shapes.
      const data = err.response?.data;
      const message =
        typeof data === 'string' ? data : data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 p-4">
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-xl shadow-brand-900/10">
        {/* Brand panel */}
        <div className="hidden md:flex md:w-[380px] shrink-0 relative overflow-hidden bg-brand-900 p-9 flex-col justify-between">
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-white/10" />
          <div className="absolute bottom-16 -left-12 w-36 h-36 rounded-full bg-white/10" />

          <div className="relative flex items-center gap-2.5">
            <div className="w-[30px] h-[30px] rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
              <span className="font-display font-semibold text-base text-brand-900">T</span>
            </div>
            <span className="font-display font-semibold text-lg text-brand-50">TrelloLite</span>
          </div>

          <div className="relative flex flex-col gap-4">
            <p className="font-display italic text-[22px] leading-snug text-brand-100 text-balance">
              "Boards, tasks and deadlines, finally living in one place."
            </p>
            <ul className="flex flex-col gap-2.5 text-[13px] text-brand-200">
              <li className="flex items-center gap-2">
                <span className="w-[5px] h-[5px] rounded-full bg-brand-300 shrink-0" />
                Unlimited boards and projects
              </li>
              <li className="flex items-center gap-2">
                <span className="w-[5px] h-[5px] rounded-full bg-brand-300 shrink-0" />
                Deadlines that actually nag you
              </li>
              <li className="flex items-center gap-2">
                <span className="w-[5px] h-[5px] rounded-full bg-brand-300 shrink-0" />
                Built for small, fast-moving teams
              </li>
            </ul>
          </div>

          <span className="relative text-xs text-ink-faint">v1.0 — self-hosted</span>
        </div>

        {/* Form panel */}
        <div className="flex-1 bg-white flex items-center justify-center p-8 sm:p-10">
          <div className="w-full max-w-[320px] flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <h1 className="font-display font-medium text-[28px] leading-tight text-ink m-0">
                Sign in
              </h1>
              <p className="text-sm text-ink-muted m-0">Pick up right where you left off.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-[13px] font-semibold text-brand-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="h-[42px] px-3 rounded-lg border border-line bg-white text-sm text-ink outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="password" className="text-[13px] font-semibold text-brand-700">
                    Password
                  </label>
                  <a href="#" className="text-xs text-brand-600 hover:text-brand-700 hover:underline">
                    Forgot?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••"
                  className="h-[42px] px-3 rounded-lg border border-line bg-white text-sm text-ink outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isGuestLoading}
                className="h-11 mt-1 rounded-lg bg-brand-600 text-brand-50 text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <div className="flex items-center gap-3">
              <span className="flex-1 h-px bg-line" />
              <span className="text-xs text-ink-faint">or</span>
              <span className="flex-1 h-px bg-line" />
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleGuest}
                disabled={isGuestLoading || isSubmitting}
                className="h-11 rounded-lg border border-brand-600 text-brand-700 text-sm font-semibold hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGuestLoading ? 'Starting demo…' : 'Try as guest'}
              </button>
              <p className="text-center text-xs text-ink-muted m-0">
                {isSlow
                  ? 'Waking up the demo server, this can take up to a minute…'
                  : 'No sign up needed. Sample data included, deleted after 24 hours.'}
              </p>
            </div>

            <p className="text-center text-[13px] text-ink-muted m-0">
              New here?{' '}
              <Link to="/register" className="text-brand-600 hover:text-brand-700 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
