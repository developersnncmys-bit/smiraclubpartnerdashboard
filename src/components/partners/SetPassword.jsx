import { useState } from 'react';
import { Lock, Loader2, Check } from 'lucide-react';
import { partnerApi } from '../../lib/partnerApi.js';

const MIN = 8;

/**
 * Setting the password a partner signs in with, next to their mobile number.
 *
 * A partner who joined with the mobile code, or whom the desk added, has
 * no password at all, and there was nowhere to make one — so the "Mobile &
 * password" door was shut to them. This is that somewhere.
 */
export default function SetPassword({ phone }) {
  const [password, setPassword] = useState('');
  const [again, setAgain] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    if (password.length < MIN) return setError(`At least ${MIN} characters`);
    if (password !== again) return setError('The two passwords do not match');
    setBusy(true);
    setError('');
    try {
      await partnerApi.setPassword(password);
      setDone(true);
      setPassword('');
      setAgain('');
    } catch (err) {
      setError(err.message || 'That did not save');
    } finally {
      setBusy(false);
    }
    return undefined;
  };

  const input =
    'input h-10 w-full rounded-xl border border-ink-900/10 bg-white px-3 text-sm outline-none focus:border-brand-400';

  return (
    <form onSubmit={save} noValidate className="rounded-xl border border-ink-900/[0.07] p-4">
      <p className="flex items-center gap-2 font-display text-sm font-extrabold text-ink-900">
        <Lock size={15} className="text-brand-600" /> Sign-in password
      </p>
      <p className="mt-1 text-xs text-ink-500">
        Set or change it, then sign in with {phone ? <span className="font-semibold text-ink-700">{phone}</span> : 'your mobile number'} and
        this password — no code needed.
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <input
          type="password"
          autoComplete="new-password"
          placeholder={`New password (${MIN}+ characters)`}
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(''); setDone(false); }}
          className={input}
        />
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Type it again"
          value={again}
          onChange={(e) => { setAgain(e.target.value); setError(''); setDone(false); }}
          className={input}
        />
      </div>

      {error && <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p>}
      {done && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
          <Check size={14} /> Password saved. Next time, use “Mobile &amp; password” to sign in.
        </p>
      )}

      <button type="submit" disabled={busy} className="btn-action btn-sm mt-3">
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />} Save password
      </button>
    </form>
  );
}
