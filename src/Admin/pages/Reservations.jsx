import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Panel, StatCard, StatsGrid, Btn, Badge, Tbl, Td } from '../components/AdminUI';
import { Modal, FormGroup, inputStyle, selectStyle, textareaStyle } from '../components/SharedUI';
import { T } from '../globalstyle';

const TABLES = ['T-01','T-02','T-03','T-04','T-05','T-06','T-07','T-08','T-09','T-10'];
const TABLE_COLORS = {
  Occupied: { bg:'rgba(42,92,63,0.3)', border:'rgba(76,175,122,0.4)', text:'#4caf7a' },
  Seated: { bg:'rgba(42,92,63,0.3)', border:'rgba(76,175,122,0.4)', text:'#4caf7a' },
  Reserved: { bg:'rgba(196,137,42,0.15)', border:'rgba(196,137,42,0.3)', text:T.adminAmber },
  Incoming: { bg:'rgba(196,137,42,0.15)', border:'rgba(196,137,42,0.3)', text:T.adminAmber },
  Pending: { bg:'rgba(196,137,42,0.15)', border:'rgba(196,137,42,0.3)', text:T.adminAmber },
  Free: { bg:'rgba(245,240,232,0.05)', border:'rgba(245,240,232,0.1)', text:'rgba(245,240,232,0.35)' },
};

export default function Reservations() {
  const { reservations, setReservations, fetchReservations, showToast, createReservation } = useApp();
  const [addOpen, setAddOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    date: today,
    time: '13:00',
    guests: 2,
    table: 'T-03',
    notes: ''
  });

  const BADGE = { Approved: 'ready', Pending: 'wait', Declined: 'danger', Seated: 'ready' };

  // Approve reservation
  const confirm = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { showToast("Not authorized!"); return; }

      const res = await fetch(`http://localhost:5000/api/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type':'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Approved' })
      });

      if (!res.ok) throw new Error('Failed to approve');

      setReservations(prev => prev.map(r => r._id === id ? { ...r, status: 'Approved' } : r));
      showToast("Reservation approved!");
    } catch (err) {
      console.error(err);
      showToast("Failed to approve reservation");
    }
  };

  // Cancel reservation
  const cancel = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { showToast("Not authorized!"); return; }

      const res = await fetch(`http://localhost:5000/api/reservations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        setReservations(prev => prev.filter(r => r._id !== id));
        showToast("Reservation cancelled");
      } else showToast("Failed to cancel reservation");
    } catch {
      showToast("Failed to cancel reservation");
    }
  };

  // Add reservation
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
      showToast("Reservation added!");
      setAddOpen(false);
      setForm({ customerName:'', email:'', phone:'', date: today, time:'13:00', guests:2, table:'T-03', notes:'' });
    }
  };

  // Dynamic table map based on reservations
  const tableStatusMap = TABLES.map(t => {
    const res = reservations.find(r => r.table === t);
    return { id: t, status: res ? res.status : 'Free' };
  });

  return (
    <div className="fade-up">
      {/* Stats */}
      <StatsGrid>
        <StatCard label="Today Total" value={reservations?.length || 0} />
        <StatCard label="Confirmed" value={reservations?.filter(r => r.status==='Approved'||r.status==='Seated').length || 0} valueColor="#4caf7a" />
        <StatCard label="Pending" value={reservations?.filter(r=>r.status==='Pending').length || 0} valueColor={T.adminAmber} />
        <StatCard label="Total Guests" value={reservations?.reduce((a,r)=>a+(Number(r.guests)||0),0) || 0} />
      </StatsGrid>

      {/* Reservation List */}
      <Panel title="Reservations" action={
        <div style={{ display:'flex', gap:10 }}>
          <input type="date" style={{ ...inputStyle(), width:160, padding:'6px 12px' }} defaultValue={today} />
          <Btn variant="primary" onClick={()=>setAddOpen(true)}>+ Add Reservation</Btn>
        </div>
      }>
        <Tbl headers={['Time','Name','Guests','Table','Phone','Status','Actions']}>
          {reservations.map(r=>(
            <tr key={r._id}>
              <Td mono>{r.time}</Td>
              <Td mono>{r.customerName}</Td>
              <Td mono>{r.guests}</Td>
              <Td mono>{r.table}</Td>
              <Td mono>{r.phone}</Td>
              <Td><Badge type={BADGE[r.status] || 'wait'}>{r.status}</Badge></Td>
              <Td>
                <div style={{ display:'flex', gap:6 }}>
                  {r.status==='Pending' && <Btn variant="success" size="sm" onClick={()=>confirm(r._id)}>Confirm</Btn>}
                  <Btn variant="danger" size="sm" onClick={()=>cancel(r._id)}>Cancel</Btn>
                </div>
              </Td>
            </tr>
          ))}
        </Tbl>
      </Panel>

      {/* Table Map */}
      <Panel title="Table Map">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, maxWidth:520 }}>
          {tableStatusMap.map(t=>{
            const c = TABLE_COLORS[t.status] || TABLE_COLORS.Free;
            return (
              <div key={t.id} style={{ background:c.bg, border:`1px solid ${c.border}`, borderRadius:8, padding:'12px 8px', textAlign:'center', cursor:'pointer' }}>
                <div style={{ fontFamily:T.mono, fontSize:'0.58rem', color:c.text }}>{t.id}</div>
                <div style={{ fontSize:'0.68rem', marginTop:4, color:c.text }}>{t.status}</div>
              </div>
            )
          })}
        </div>
        <div style={{ display:'flex', gap:20, marginTop:14, fontFamily:T.mono, fontSize:'0.53rem', color:'rgba(245,240,232,0.4)' }}>
          {[
            ['Occupied','rgba(42,92,63,0.6)'],
            ['Reserved/Pending','rgba(196,137,42,0.5)'],
            ['Free','rgba(245,240,232,0.12)']
          ].map(([l,bg])=>(
            <span key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:10,height:10,background:bg,borderRadius:2,display:'inline-block' }} />
              {l}
            </span>
          ))}
        </div>
      </Panel>

      {/* Add Reservation Modal */}
      <Modal title="New Reservation" open={addOpen} onClose={()=>setAddOpen(false)}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <FormGroup label="Name *">
            <input style={inputStyle()} value={form.customerName} onChange={e=>setForm(p=>({...p, customerName:e.target.value}))} placeholder="Customer name" />
          </FormGroup>
          <FormGroup label="Email *">
            <input type='email' style={inputStyle()} value={form.email} onChange={e=>setForm(p=>({...p, email:e.target.value}))} placeholder="Email" />
          </FormGroup>
          <FormGroup label="Phone">
            <input style={inputStyle()} value={form.phone} onChange={e=>setForm(p=>({...p, phone:e.target.value}))} placeholder="010-0000-0000" />
          </FormGroup>
          <FormGroup label="Date">
            <input type="date" style={inputStyle()} value={form.date} onChange={e=>setForm(p=>({...p, date:e.target.value}))} />
          </FormGroup>
          <FormGroup label="Time">
            <input type="time" style={inputStyle()} value={form.time} onChange={e=>setForm(p=>({...p, time:e.target.value}))} />
          </FormGroup>
          <FormGroup label="Guests">
            <input type="number" style={inputStyle()} value={form.guests} min={1} max={20} onChange={e=>setForm(p=>({...p, guests:parseInt(e.target.value)||1}))} />
          </FormGroup>
          <FormGroup label="Table">
            <select style={selectStyle()} value={form.table} onChange={e=>setForm(p=>({...p, table:e.target.value}))}>
              {TABLES.map(t=><option key={t}>{t}</option>)}
            </select>
          </FormGroup>
        </div>

        <FormGroup label="Notes">
          <textarea style={textareaStyle()} value={form.notes} onChange={e=>setForm(p=>({...p, notes:e.target.value}))} placeholder="Special requests…" />
        </FormGroup>

        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:16 }}>
          <Btn variant="ghost" onClick={()=>setAddOpen(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={add}>Confirm Reservation</Btn>
        </div>
      </Modal>
    </div>
  );
}