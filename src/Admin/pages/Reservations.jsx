import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Panel, StatCard, StatsGrid, Btn, Badge, Tbl, Td } from '../components/AdminUI';
import { Modal, FormGroup, inputStyle, selectStyle, textareaStyle } from '../components/SharedUI';
import { T } from '../globalstyle';
import API from '../../services/api';
import initSocket from '../../services/Soket.js';

const TABLES = ['T-01', 'T-02', 'T-03', 'T-04', 'T-05', 'T-06', 'T-07', 'T-08', 'T-09', 'T-10'];
const TABLE_COLORS = {
  Approved: { bg: 'rgba(42,92,63,0.3)', border: 'rgba(76,175,122,0.4)', text: '#4caf7a' },
  Seated: { bg: 'rgba(42,92,63,0.3)', border: 'rgba(76,175,122,0.4)', text: '#4caf7a' },
  Reserved: { bg: 'rgba(196,137,42,0.15)', border: 'rgba(196,137,42,0.3)', text: T.adminAmber },
  Incoming: { bg: 'rgba(196,137,42,0.15)', border: 'rgba(196,137,42,0.3)', text: T.adminAmber },
  Pending: { bg: 'rgba(196,137,42,0.15)', border: 'rgba(196,137,42,0.3)', text: T.adminAmber },
  Free: { bg: 'rgba(245,240,232,0.05)', border: 'rgba(245,240,232,0.1)', text: 'rgba(245,240,232,0.35)' },
};

export default function Reservations() {
  const { reservations, setReservations, fetchReservations, showToast, createReservation } = useApp();
  const safeReservations = (Array.isArray(reservations) ? reservations : []).filter(Boolean);

  const [addOpen, setAddOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirmTable, setConfirmTable] = useState('T-01');
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [cancelId, setCancelId] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const [form, setForm] = useState({
    customerName: '', email: '', phone: '',
    date: today, time: '13:00', guests: 2, table: 'T-03', notes: ''
  });

  const BADGE = { Approved: 'ready', Pending: 'wait', Declined: 'danger', Seated: 'ready', Cancelled: 'danger' };
  const FREE_STATUSES = ['Declined', 'Cancelled', 'Done'];
  const getToken = () => localStorage.getItem('token');

  // ── Fetch on date change ───────────────────────────────────────────────────
  useEffect(() => {
    fetchReservations(selectedDate);
  }, [selectedDate]);

  // ── Socket.io real-time listener ───────────────────────────────────────────
  useEffect(() => {
    const handler = () => fetchReservations(selectedDate);

    initSocket.on('reservations:updated', handler);
    return () => initSocket.off('reservations:updated', handler);
  }, [selectedDate]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const occupiedTables = (date, excludeId = null) =>
  safeReservations
    .filter(r =>
      r._id !== excludeId &&
      !FREE_STATUSES.includes(r.status) &&
      r.table &&
      r.date?.split('T')[0] === date
    )
    .map(r => r.table);

const sortedReservations = safeReservations
  .sort((a, b) => (a?._id && b?._id ? (b._id > a._id ? 1 : -1) : 0))
  .filter(r => r?.date?.split('T')[0] === selectedDate);
  
  // ── Status update ──────────────────────────────────────────────────────────
  const TOAST = { Approved: 'Reservation approved!', Cancelled: 'Reservation cancelled', Done: 'Table marked as Done!' };

  const updateStatus = async (id, status, extra = {}) => {
    try {
      const token = getToken();
      if (!token) { showToast('Not authorized!'); return; }

      await API.put(`/${id}/status`, { status, ...extra }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReservations(prev =>
        prev.map(r => r._id === id ? { ...r, status, ...extra } : r)
      );
      showToast(TOAST[status] || 'Updated!');
    } catch (err) {
      console.error(err.response?.data || err.message);
      showToast('Update failed');
    }
  };

  // ── Confirm ────────────────────────────────────────────────────────────────
  const openConfirm = (reservation) => {
    const resDate = reservation.date?.split('T')[0] || today;
    const taken = occupiedTables(resDate, reservation._id);
    const hasTable = reservation.table && !taken.includes(reservation.table);

    if (hasTable) {
      confirmDirect(reservation._id, reservation.table);
    } else {
      const free = TABLES.find(t => !taken.includes(t)) || TABLES[0];
      setConfirmTarget(reservation);
      setConfirmTable(free);
      setConfirmOpen(true);
    }
  };

  const confirmDirect = (id, table) => {
    const reservation = reservations.find(r => r._id === id);
    const resDate = reservation?.date?.split('T')[0] || today;
    if (occupiedTables(resDate, id).includes(table)) {
      showToast(`Table ${table} is already booked on this date!`);
      return;
    }
    updateStatus(id, 'Approved', { table });
  };

  const confirm = () => {
    if (!confirmTarget) return;
    updateStatus(confirmTarget._id, 'Approved', { table: confirmTable });
    setConfirmOpen(false);
    setConfirmTarget(null);
  };

  const cancel = (id) => setCancelId(id);
  const release = (id) => updateStatus(id, 'Done');

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteReservation = async () => {
    try {
      const token = getToken();
      if (!token) { showToast('Not authorized!'); return; }

      await API.delete(`/${deleteTarget}/delete`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReservations(prev => prev.filter(r => r._id !== deleteTarget));
      showToast('Reservation deleted');
    } catch (err) {
      console.error(err.response?.data || err.message);
      showToast('Failed to delete reservation');
    } finally {
      setDeleteTarget(null);
    }
  };

  // ── Edit ───────────────────────────────────────────────────────────────────
  const openEdit = (reservation) => {
    setEditTarget(reservation);
    setEditForm({
      customerName: reservation.customerName || '',
      email: reservation.email || '',
      phone: reservation.phone || '',
      date: reservation.date ? reservation.date.split('T')[0] : today,
      time: reservation.time || '13:00',
      guests: reservation.guests || 2,
      table: reservation.table || 'T-01',
      notes: reservation.specialRequest || '',
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editTarget) return;
    if (!editForm.customerName || !editForm.email || !editForm.phone) {
      showToast('Please fill all required fields.');
      return;
    }
    const id = editTarget._id;
    try {
      const token = getToken();
      if (!token) { showToast('Not authorized!'); return; }

      const payload = {
        customerName: editForm.customerName,
        email: editForm.email,
        phone: editForm.phone,
        date: editForm.date,
        time: editForm.time,
        guests: Number(editForm.guests),
        table: editForm.table,
        specialRequest: editForm.notes,
      };

      await API.put(`/reservations/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReservations(prev => prev.map(r => r._id === id ? { ...r, ...payload } : r));
      showToast('Reservation updated!');
      setEditOpen(false);
      setEditTarget(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
      showToast('Failed to update reservation');
    }
  };

  // ── Add ────────────────────────────────────────────────────────────────────
  const add = async () => {
    if (!form.customerName || !form.email || !form.phone) {
      showToast('Please fill all required fields.');
      return;
    }

    const payload = {
      customerName: form.customerName,
      email: form.email,
      phone: form.phone,
      date: form.date,
      time: form.time,
      guests: Number(form.guests),
      table: form.table || '-',
      status: 'Pending',
      specialRequest: form.notes
    };

    const newRes = await createReservation(payload);
    if (newRes) {
      showToast('Reservation added!');
      setAddOpen(false);
      setForm({ customerName: '', email: '', phone: '', date: today, time: '13:00', guests: 2, table: 'T-03', notes: '' });
    }
  };

  // ── Table map ──────────────────────────────────────────────────────────────
  const tableStatusMap = TABLES.map(t => {
    const res = safeReservations.find(r =>
      r &&
      r.table === t &&
      !FREE_STATUSES.includes(r.status) &&
      r.date?.split('T')[0] === selectedDate
    );

    return { id: t, status: res ? res.status : 'Free' };
  });

  return (
    <div className="fade-up">
      <StatsGrid>
        <StatCard label="Today Total" value={safeReservations.length} />

        <StatCard
          label="Confirmed"
          value={safeReservations.filter(r => r?.status === 'Approved' || r?.status === 'Seated').length}
          valueColor="#4caf7a"
        />

        <StatCard
          label="Pending"
          value={safeReservations.filter(r => r?.status === 'Pending').length}
          valueColor={T.adminAmber}
        />

        <StatCard
          label="Total Guests"
          value={safeReservations.reduce((a, r) => a + (Number(r?.guests) || 0), 0)}
        />
      </StatsGrid>

      <Panel title="Reservations" action={
        <div style={{ display: 'flex', gap: 10 }}>
          <input type="date" style={{ ...inputStyle(), width: 160, padding: '6px 12px' }} value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
          <Btn variant="primary" onClick={() => setAddOpen(true)}>+ Add Reservation</Btn>
        </div>
      }>
        <Tbl headers={['Time', 'Name', 'Guests', 'Table', 'Phone', 'Status', 'Actions']}>
          {sortedReservations.map(r => (
            <tr key={r._id || r.id}>
              <Td mono>{r.time}</Td>
              <Td mono>{r.customerName}</Td>
              <Td mono>{r.guests}</Td>
              <Td mono>{r.table}</Td>
              <Td mono>{r.phone}</Td>
              <Td><Badge type={BADGE[r.status] || 'wait'}>{r.status}</Badge></Td>
              <Td>
                <div style={{ display: 'flex', gap: 6 }}>
                  {FREE_STATUSES.includes(r.status) ? (
                    <Btn variant="danger" size="sm" onClick={() => setDeleteTarget(r._id)}>Delete</Btn>
                  ) : (
                    <>
                      {r.status === 'Pending' && <Btn variant="success" size="sm" onClick={() => openConfirm(r)}>Confirm</Btn>}
                      {r.status === 'Approved' && <Btn variant="danger" size="sm" onClick={() => release(r._id)}>Release</Btn>}
                      <Btn variant="ghost" size="sm" onClick={() => openEdit(r)}>Edit</Btn>
                      <Btn variant="danger" size="sm" onClick={() => cancel(r._id)}>Cancel</Btn>
                    </>
                  )}
                </div>
              </Td>
            </tr>
          ))}
        </Tbl>
      </Panel>

      <Panel title="Table Map">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, maxWidth: 520 }}>
          {tableStatusMap.map(t => {
            const c = TABLE_COLORS[t.status] || TABLE_COLORS.Free;
            return (
              <div
                key={t.id}
                onClick={() => {
                  if (t.status === 'Free') return;
                  const res = safeReservations.find(r =>
                    r &&
                    r.table === t.id &&
                    !FREE_STATUSES.includes(r.status) &&
                    r.date?.split('T')[0] === selectedDate
                  );
                  if (res) release(res._id);
                }}
                style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, padding: '12px 8px', textAlign: 'center', cursor: t.status === 'Free' ? 'default' : 'pointer' }}
                title={t.status !== 'Free' ? 'Click to release table' : ''}
              >
                <div style={{ fontFamily: T.mono, fontSize: '0.58rem', color: c.text }}>{t.id}</div>
                <div style={{ fontSize: '0.68rem', marginTop: 4, color: c.text }}>{t.status}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 14, fontFamily: T.mono, fontSize: '0.53rem', color: 'rgba(245,240,232,0.4)' }}>
          {[['Occupied', 'rgba(42,92,63,0.6)'], ['Reserved/Pending', 'rgba(196,137,42,0.5)'], ['Free', 'rgba(245,240,232,0.12)']].map(([l, bg]) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, background: bg, borderRadius: 2, display: 'inline-block' }} />
              {l}
            </span>
          ))}
        </div>
      </Panel>

      {/* Confirm Modal */}
      <Modal title="Confirm Reservation" open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        {confirmTarget && (
          <>
            <p style={{ color: 'rgba(245,240,232,0.7)', fontSize: '0.85rem', marginBottom: 16 }}>
              Confirming reservation for <strong style={{ color: 'rgba(245,240,232,0.95)' }}>{confirmTarget.customerName}</strong>
              {' '}({confirmTarget.guests} guests) at {confirmTarget.time}.
            </p>
            <FormGroup label="Assign Table">
              <select style={selectStyle()} value={confirmTable} onChange={e => setConfirmTable(e.target.value)}>
                {TABLES.map(t => {
                  const resDate = confirmTarget.date?.split('T')[0] || today;
                  const isOccupied = occupiedTables(resDate, confirmTarget._id).includes(t);
                  return <option key={t} value={t} disabled={isOccupied}>{t}{isOccupied ? ' (Occupied)' : ''}</option>;
                })}
              </select>
            </FormGroup>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
              <Btn variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Btn>
              <Btn variant="success" onClick={confirm}>Approve</Btn>
            </div>
          </>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal title="Edit Reservation" open={editOpen} onClose={() => setEditOpen(false)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormGroup label="Name *"><input style={inputStyle()} value={editForm.customerName || ''} onChange={e => setEditForm(p => ({ ...p, customerName: e.target.value }))} placeholder="Customer name" /></FormGroup>
          <FormGroup label="Email *"><input type="email" style={inputStyle()} value={editForm.email || ''} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" /></FormGroup>
          <FormGroup label="Phone *"><input style={inputStyle()} value={editForm.phone || ''} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} placeholder="010-0000-0000" /></FormGroup>
          <FormGroup label="Date"><input type="date" style={inputStyle()} value={editForm.date || ''} onChange={e => setEditForm(p => ({ ...p, date: e.target.value }))} /></FormGroup>
          <FormGroup label="Time"><input type="time" style={inputStyle()} value={editForm.time || ''} onChange={e => setEditForm(p => ({ ...p, time: e.target.value }))} /></FormGroup>
          <FormGroup label="Guests"><input type="number" style={inputStyle()} value={editForm.guests || 1} min={1} max={20} onChange={e => setEditForm(p => ({ ...p, guests: parseInt(e.target.value) || 1 }))} /></FormGroup>
          <FormGroup label="Table">
            <select style={selectStyle()} value={editForm.table || 'T-01'} onChange={e => setEditForm(p => ({ ...p, table: e.target.value }))}>
              {TABLES.map(t => {
                const isOccupied = occupiedTables(editForm.date || today, editTarget?._id).includes(t);
                return <option key={t} value={t} disabled={isOccupied}>{t}{isOccupied ? ' (Occupied)' : ''}</option>;
              })}
            </select>
          </FormGroup>
        </div>
        <FormGroup label="Notes"><textarea style={textareaStyle()} value={editForm.notes || ''} onChange={e => setEditForm(p => ({ ...p, notes: e.target.value }))} placeholder="Special requests…" /></FormGroup>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <Btn variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={saveEdit}>Save Changes</Btn>
        </div>
      </Modal>

      {/* Add Modal */}
      <Modal title="New Reservation" open={addOpen} onClose={() => setAddOpen(false)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormGroup label="Name *"><input style={inputStyle()} value={form.customerName} onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))} placeholder="Customer name" /></FormGroup>
          <FormGroup label="Email *"><input type='email' style={inputStyle()} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" /></FormGroup>
          <FormGroup label="Phone"><input style={inputStyle()} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="010-0000-0000" /></FormGroup>
          <FormGroup label="Date"><input type="date" style={inputStyle()} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></FormGroup>
          <FormGroup label="Time"><input type="time" style={inputStyle()} value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} /></FormGroup>
          <FormGroup label="Guests"><input type="number" style={inputStyle()} value={form.guests} min={1} max={20} onChange={e => setForm(p => ({ ...p, guests: parseInt(e.target.value) || 1 }))} /></FormGroup>
          <FormGroup label="Table">
            <select style={selectStyle()} value={form.table} onChange={e => setForm(p => ({ ...p, table: e.target.value }))}>
              {TABLES.map(t => {
                const isOccupied = occupiedTables(form.date).includes(t);
                return <option key={t} value={t} disabled={isOccupied}>{t}{isOccupied ? ' (Occupied)' : ''}</option>;
              })}
            </select>
          </FormGroup>
        </div>
        <FormGroup label="Notes"><textarea style={textareaStyle()} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Special requests…" /></FormGroup>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <Btn variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={add}>Confirm Reservation</Btn>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal title="Delete Reservation" open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <p style={{ color: 'rgba(245,240,232,0.7)', fontSize: '0.85rem', marginBottom: 20 }}>
          Are you sure you want to permanently delete this reservation? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn variant="ghost" onClick={() => setDeleteTarget(null)}>No, Keep It</Btn>
          <Btn variant="danger" onClick={deleteReservation}>Yes, Delete</Btn>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal title="Cancel Reservation" open={!!cancelId} onClose={() => setCancelId(null)}>
        <p style={{ color: 'rgba(245,240,232,0.7)', fontSize: '0.85rem', marginBottom: 20 }}>
          Are you sure you want to cancel this reservation?
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn variant="ghost" onClick={() => setCancelId(null)}>No, Keep It</Btn>
          <Btn variant="danger" onClick={() => { updateStatus(cancelId, 'Cancelled'); setCancelId(null); }}>Yes, Cancel</Btn>
        </div>
      </Modal>
    </div>
  );
}