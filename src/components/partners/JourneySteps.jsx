import { Check, Phone } from 'lucide-react';

/**
 * Where a new partner is on the way to taking bookings, in four plain
 * stages, with the one they are on picked out.
 *
 * A hotelier arriving here saw a long form and nothing about what happens
 * after it — whether it saves, who looks at it, when they can take a
 * booking. This answers that before they start typing.
 */
const STAGES = [
  { key: 'fill', title: 'Fill in your listing', body: '5 short steps. Each step saves, so you can stop and come back.' },
  { key: 'review', title: 'Smira checks it', body: 'We check the property, rates and papers — usually 1–2 working days.' },
  { key: 'contract', title: 'Sign the contract', body: 'We send the agreement. Sign it and you are ready.' },
  { key: 'live', title: 'Go live', body: 'Members see your property and you get booking requests here.' },
];

/** Which stage a partner's record is at. */
const stageIndex = (me) => {
  if (me?.live) return 3;
  if (me?.stage === 'Contract') return 2;
  if (me?.stage === 'Admin review') return 1;
  return 0;
};

export default function JourneySteps({ me, deskPhone, deskTel }) {
  const at = stageIndex(me);
  return (
    <div className="mt-4">
      <ol className="space-y-0">
        {STAGES.map((s, i) => {
          const done = i < at;
          const now = i === at;
          return (
            <li key={s.key} className="relative flex gap-3 pb-4 last:pb-0">
              {/* The line down to the next stage. */}
              {i < STAGES.length - 1 && (
                <span aria-hidden className={`absolute left-[13px] top-7 h-[calc(100%-1.5rem)] w-0.5 ${done ? 'bg-emerald-400' : 'bg-ink-900/10'}`} />
              )}
              <span
                className={`relative z-[1] grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-extrabold ${
                  done ? 'bg-emerald-500 text-white' : now ? 'bg-brand-600 text-white ring-4 ring-brand-100' : 'bg-surface-soft text-ink-400'
                }`}
              >
                {done ? <Check size={14} strokeWidth={3} /> : i + 1}
              </span>
              <span className="min-w-0 pt-0.5">
                <span className={`block text-sm font-bold ${now ? 'text-brand-800' : done ? 'text-ink-700' : 'text-ink-500'}`}>
                  {s.title}
                  {now && <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 align-middle text-[10px] font-extrabold uppercase tracking-wide text-brand-700">You are here</span>}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-ink-500">{s.body}</span>
              </span>
            </li>
          );
        })}
      </ol>

      <a
        href={deskTel}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5 text-sm font-bold text-brand-800 active:bg-brand-100"
      >
        <Phone size={15} /> Need help filling it in? Call {deskPhone}
      </a>
    </div>
  );
}
