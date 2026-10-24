import { useEffect } from 'react';
import { LayoutDashboard, CalendarCheck, CalendarDays, Wallet, LayoutGrid, X } from 'lucide-react';

/**
 * The partner portal's bar along the bottom of a phone, the way a mobile CRM
 * is held: the four places a partner lives in under the thumb, and the rest
 * of the fourteen sections behind More, as a sheet of tiles.
 *
 * The desktop keeps its side rail; this only shows below lg.
 */
const TABS = [
  { key: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { key: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { key: 'calendar', label: 'Calendar', icon: CalendarDays },
  { key: 'payments', label: 'Payments', icon: Wallet },
];

export default function PortalTabBar({ section, onSection, sections, waiting = 0, moreOpen, setMoreOpen }) {
  // Back button and Escape close the sheet rather than leaving the portal.
  useEffect(() => {
    if (!moreOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMoreOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [moreOpen, setMoreOpen]);

  const inMore = !TABS.some((t) => t.key === section);
  const item = 'relative flex flex-1 flex-col items-center justify-center gap-1 pb-1.5 pt-2 text-[11px] font-bold';

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink-900/[0.08] bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_-12px_rgba(11,21,36,0.25)] backdrop-blur lg:hidden"
        aria-label="Portal sections"
      >
        {TABS.map(({ key, label, icon: Icon }) => {
          const on = section === key && !moreOpen;
          const badge = key === 'bookings' ? waiting : 0;
          return (
            <button key={key} type="button" onClick={() => onSection(key)} className={`${item} ${on ? 'text-brand-700' : 'text-ink-400'}`}>
              {on && <span className="absolute top-0 h-[3px] w-10 rounded-b-full bg-brand-600" />}
              <span className={`relative grid h-7 w-12 place-items-center rounded-full ${on ? 'bg-brand-50' : ''}`}>
                <Icon size={19} strokeWidth={on ? 2.4 : 2} />
                {badge > 0 && (
                  <span className="num absolute -right-0.5 -top-1 min-w-[18px] rounded-full bg-coral px-1 text-center text-[10px] font-bold leading-[18px] text-white ring-2 ring-white">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </span>
              {label}
            </button>
          );
        })}
        <button type="button" onClick={() => setMoreOpen(true)} className={`${item} ${inMore || moreOpen ? 'text-brand-700' : 'text-ink-400'}`}>
          {(inMore || moreOpen) && <span className="absolute top-0 h-[3px] w-10 rounded-b-full bg-brand-600" />}
          <span className={`grid h-7 w-12 place-items-center rounded-full ${inMore || moreOpen ? 'bg-brand-50' : ''}`}>
            <LayoutGrid size={19} />
          </span>
          More
        </button>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden" role="dialog" aria-label="All sections">
          <div className="absolute inset-0 bg-ink-900/45 backdrop-blur-sm" onClick={() => setMoreOpen(false)} />
          <div className="relative w-full rounded-t-3xl bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-2 shadow-lift">
            <span aria-hidden className="mx-auto block h-1.5 w-10 rounded-full bg-ink-900/15" />
            <div className="mb-3 mt-2 flex items-center justify-between">
              <p className="font-display text-base font-extrabold text-ink-900">All sections</p>
              <button type="button" onClick={() => setMoreOpen(false)} className="icon-btn" aria-label="Close">
                <X size={17} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {sections.map(({ key, label, icon: Icon }) => {
                const on = section === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onSection(key);
                      setMoreOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border px-1 py-3 text-center text-[11px] font-bold leading-tight transition ${
                      on ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-ink-900/[0.07] bg-white text-ink-600 active:bg-surface-soft'
                    }`}
                  >
                    <span className={`grid h-9 w-9 place-items-center rounded-xl ${on ? 'bg-brand-600 text-white' : 'bg-surface-soft text-ink-500'}`}>
                      <Icon size={18} />
                    </span>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
