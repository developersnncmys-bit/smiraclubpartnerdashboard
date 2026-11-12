import { useCallback, useEffect, useState } from 'react';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { partnerApi } from '../../lib/partnerApi.js';

/**
 * The partner changes their own listing: property details, rooms released
 * and the rates of each room type. Live straight away — the desk sees every
 * change in the partner's history. The commission and the contract stay
 * with the desk.
 *
 * mode: 'property' | 'rooms' | 'rates' — which part of each property shows.
 */
const inr = (n) => (n || n === 0 ? `₹${Number(n).toLocaleString('en-IN')}` : '—');

function Field({ label, children, wide }) {
  return (
    <label className={`block min-w-0 ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-400">{label}</span>
      {children}
    </label>
  );
}

const input = 'w-full min-w-0 rounded-xl border border-ink-900/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500';

function Editor({ item, mode, onSaved }) {
  const [f, setF] = useState(() => ({ ...item, amenities: (item.amenities || []).join(', ') }));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const setRoom = (i, k, v) => setF((x) => ({ ...x, rooms: x.rooms.map((r, n) => (n === i ? { ...r, [k]: v } : r)) }));

  const save = async () => {
    setBusy(true);
    setMsg('');
    const body =
      mode === 'property'
        ? {
            description: f.description,
            address: f.address,
            checkIn: f.checkIn,
            checkOut: f.checkOut,
            contact: f.contact,
            amenities: String(f.amenities || '').split(',').map((a) => a.trim()).filter(Boolean),
          }
        : mode === 'rooms'
          ? { units: f.units, status: f.status, rooms: f.rooms }
          : { baseRate: f.baseRate, rooms: f.rooms };
    try {
      const res = await partnerApi.updateStock(item.id, body);
      setMsg(res.message === 'Nothing changed' ? 'Nothing changed' : 'Saved — live now');
      onSaved?.(res.data);
    } catch (err) {
      setMsg(err.message || 'That did not save');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-3 space-y-3 rounded-xl border border-brand-200 bg-brand-50/40 p-3">
      {mode === 'property' && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Description" wide>
            <textarea className={`${input} min-h-[6rem]`} value={f.description} onChange={set('description')} />
          </Field>
          <Field label="Address" wide><input className={input} value={f.address} onChange={set('address')} /></Field>
          <Field label="Check-in time"><input className={input} value={f.checkIn} onChange={set('checkIn')} placeholder="e.g. 12:00 pm" /></Field>
          <Field label="Check-out time"><input className={input} value={f.checkOut} onChange={set('checkOut')} placeholder="e.g. 11:00 am" /></Field>
          <Field label="Contact at the property"><input className={input} value={f.contact} onChange={set('contact')} /></Field>
          <Field label="Amenities (comma between)" wide>
            <input className={input} value={f.amenities} onChange={set('amenities')} placeholder="Pool, Wi-Fi, Parking" />
          </Field>
        </div>
      )}

      {mode === 'rooms' && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Rooms released to Smira">
            <input type="number" min={f.booked || 0} className={input} value={f.units} onChange={set('units')} />
            <span className="mt-1 block text-xs text-ink-500">{f.booked} already booked — at least that many.</span>
          </Field>
          <Field label="Taking stays">
            <select className={input} value={f.status === 'Blocked' ? 'Blocked' : 'Active'} onChange={set('status')}>
              <option value="Active">Yes — open</option>
              <option value="Blocked">No — paused</option>
            </select>
          </Field>
        </div>
      )}

      {(mode === 'rooms' || mode === 'rates') && (
        <div className="space-y-2">
          {mode === 'rates' && (
            <Field label="Base rate per night (₹)">
              <input type="number" min="0" className={input} value={f.baseRate} onChange={set('baseRate')} />
            </Field>
          )}
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-400">Room types</p>
          {(f.rooms || []).map((r, i) => (
            <div key={i} className="rounded-xl border border-ink-900/10 bg-white p-2.5">
              <div className="flex items-center gap-2">
                <input className={`${input} font-semibold`} value={r.type} onChange={(e) => setRoom(i, 'type', e.target.value)} placeholder="Room type" />
                <button
                  type="button"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-rose-600 hover:bg-rose-50"
                  title="Remove this room type"
                  onClick={() => setF((x) => ({ ...x, rooms: x.rooms.filter((_, n) => n !== i) }))}
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {mode === 'rooms' ? (
                  <>
                    <Field label="Rooms"><input type="number" min="0" className={input} value={r.count} onChange={(e) => setRoom(i, 'count', e.target.value)} /></Field>
                    <Field label="Guests per room"><input type="number" min="1" className={input} value={r.occupancy} onChange={(e) => setRoom(i, 'occupancy', e.target.value)} /></Field>
                    <Field label="Meal plan" wide><input className={input} value={r.mealPlan} onChange={(e) => setRoom(i, 'mealPlan', e.target.value)} placeholder="e.g. Breakfast" /></Field>
                  </>
                ) : (
                  <>
                    <Field label="Rack rate"><input type="number" min="0" className={input} value={r.rack ?? ''} onChange={(e) => setRoom(i, 'rack', e.target.value)} /></Field>
                    <Field label="Smira rate"><input type="number" min="0" className={input} value={r.smira ?? ''} onChange={(e) => setRoom(i, 'smira', e.target.value)} /></Field>
                    <Field label="Member rate"><input type="number" min="0" className={input} value={r.member ?? ''} onChange={(e) => setRoom(i, 'member', e.target.value)} /></Field>
                    <Field label="Weekend rate"><input type="number" min="0" className={input} value={r.weekend ?? ''} onChange={(e) => setRoom(i, 'weekend', e.target.value)} /></Field>
                  </>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn-line btn-sm"
            onClick={() => setF((x) => ({ ...x, rooms: [...(x.rooms || []), { type: '', count: 0, occupancy: 2, mealPlan: '', rack: null, smira: null, member: null, weekend: null }] }))}
          >
            <Plus size={14} /> Add a room type
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn-action btn-sm" disabled={busy} onClick={save}>
          {busy ? <Loader2 size={14} className="animate-spin" /> : null} Save
        </button>
        {msg && <span className={`text-sm font-semibold ${msg.startsWith('Saved') ? 'text-emerald-700' : 'text-ink-600'}`}>{msg}</span>}
      </div>
    </div>
  );
}

export default function StockEditor({ mode, onChanged }) {
  const [items, setItems] = useState(null);
  const [open, setOpen] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await partnerApi.stock();
      setItems(res.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load your properties');
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  if (error) return <p className="text-sm text-rose-600">{error}</p>;
  if (!items) return <p className="flex items-center gap-2 text-sm text-ink-500"><Loader2 size={14} className="animate-spin" /> Loading…</p>;
  if (!items.length) return <p className="text-sm text-ink-500">Nothing released yet. The desk adds your property when your rate plan is signed.</p>;

  const title = { property: 'Edit details', rooms: 'Edit rooms', rates: 'Edit rates' }[mode];
  return (
    <div className="space-y-3">
      {items.map((i) => (
        <div key={i.id} className="rounded-xl border border-ink-900/[0.08] bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-bold text-ink-900">{i.name}</p>
              <p className="truncate text-xs text-ink-500">
                {mode === 'property' && [i.destination, i.checkIn && `In ${i.checkIn}`, i.checkOut && `Out ${i.checkOut}`].filter(Boolean).join(' · ')}
                {mode === 'rooms' && `${i.units} released · ${i.booked} booked · ${i.status === 'Blocked' ? 'paused' : 'open'}`}
                {mode === 'rates' && `Base ${inr(i.baseRate)} · ${i.rooms.length} room type(s)`}
              </p>
            </div>
            <button type="button" className="btn-line btn-sm shrink-0" onClick={() => setOpen(open === i.id ? null : i.id)}>
              <Pencil size={13} /> {open === i.id ? 'Close' : title}
            </button>
          </div>
          {open === i.id && (
            <Editor
              key={`${i.id}-${mode}`}
              item={i}
              mode={mode}
              onSaved={(fresh) => {
                setItems((list) => list.map((x) => (x.id === fresh.id ? fresh : x)));
                onChanged?.();
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
