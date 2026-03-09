import { useEffect, useState, useRef } from 'react';
import { Panel, StatCard, StatsGrid, Badge, Tbl, Td, Btn } from '../components/AdminUI';
import { T } from '../globalstyle';
import API, { UPLOAD_BASE } from '../../services/api';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    role: '',
    type: 'Full Time',
    status: 'On Shift',
    since: '',
    hours: '',
    schedule: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    onboardedDoc: '',
  });
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(form);
  const [updating, setUpdating] = useState(false);

  const [profileStaff, setProfileStaff] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showOnboard, setShowOnboard] = useState(false);
  const formPhotoRef = useRef(null);
  const formDocRef = useRef(null);
  const editPhotoRef = useRef(null);
  const editDocRef = useRef(null);

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/staff', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaff(res.data || []);
      } catch (err) {
        console.error('FETCH STAFF ERROR:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load staff');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const onShiftCount = staff.filter((s) => s.status === 'On Shift').length;
  const dayOffCount = staff.filter((s) => s.status === 'Day Off').length;

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const parseSchedule = (scheduleText) => {
    if (!scheduleText) return [];
    return scheduleText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 7);
  };

  const handleAddStaff = async () => {
    if (!form.name || !form.role) {
      setError('Name and role are required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('role', form.role);
      fd.append('type', form.type);
      fd.append('status', form.status);
      fd.append('since', form.since);
      fd.append('hours', form.hours);
      fd.append('schedule', form.schedule);
      fd.append('email', form.email);
      fd.append('phone', form.phone);
      fd.append('address', form.address);
      fd.append('emergencyContact', form.emergencyContact);
      fd.append('onboardedDoc', form.onboardedDoc);
      const photoFile = formPhotoRef.current?.files?.[0];
      const docFile = formDocRef.current?.files?.[0];
      if (photoFile) fd.append('photo', photoFile);
      if (docFile) fd.append('onboardedDocFile', docFile);

      const res = await API.post('/staff', fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStaff((prev) => [res.data, ...prev]);
      setForm({
        name: '',
        role: '',
        type: 'Full Time',
        status: 'On Shift',
        since: '',
        hours: '',
        schedule: '',
        email: '',
        phone: '',
        address: '',
        emergencyContact: '',
        onboardedDoc: '',
      });
      if (formPhotoRef.current) formPhotoRef.current.value = '';
      if (formDocRef.current) formDocRef.current.value = '';
    } catch (err) {
      console.error('ADD STAFF ERROR:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to add staff');
    } finally {
      setSaving(false);
    }
  };

  const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    // Remove trailing slash from base, ensure leading slash on path
    const base = UPLOAD_BASE.replace(/\/$/, '');
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${base}${path}`;
  };


  const startEdit = (member) => {
    setEditingId(member._id);
    setEditForm({
      name: member.name || '',
      role: member.role || '',
      type: member.type || 'Full Time',
      status: member.status || 'On Shift',
      since: member.since || '',
      hours: member.hours || '',
      schedule: Array.isArray(member.schedule)
        ? member.schedule.join(', ')
        : '',
      email: member.email || '',
      phone: member.phone || '',
      address: member.address || '',
      emergencyContact: member.emergencyContact || '',
      onboardedDoc: member.onboardedDoc || '',
    });
  };

  const openProfile = (member) => setProfileStaff(member);
  const closeProfile = () => setProfileStaff(null);

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdateStaff = async () => {
    if (!editingId) return;
    if (!editForm.name || !editForm.role) {
      setError('Name and role are required');
      return;
    }

    setUpdating(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('name', editForm.name);
      fd.append('role', editForm.role);
      fd.append('type', editForm.type);
      fd.append('status', editForm.status);
      fd.append('since', editForm.since);
      fd.append('hours', editForm.hours);
      fd.append('schedule', editForm.schedule);
      fd.append('email', editForm.email);
      fd.append('phone', editForm.phone);
      fd.append('address', editForm.address);
      fd.append('emergencyContact', editForm.emergencyContact);
      fd.append('onboardedDoc', editForm.onboardedDoc);
      const photoFile = editPhotoRef.current?.files?.[0];
      const docFile = editDocRef.current?.files?.[0];
      if (photoFile) fd.append('photo', photoFile);
      if (docFile) fd.append('onboardedDocFile', docFile);

      const res = await API.put(`/staff/${editingId}`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStaff((prev) =>
        prev.map((s) => (s._id === editingId ? res.data : s))
      );
      setEditingId(null);
      if (editPhotoRef.current) editPhotoRef.current.value = '';
      if (editDocRef.current) editDocRef.current.value = '';
    } catch (err) {
      console.error('UPDATE STAFF ERROR:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to update staff');
    } finally {
      setUpdating(false);
    }
  };

  const getWeekLabel = () => {
    const now = new Date();
    const day = now.getDay(); // 0 (Sun) - 6 (Sat)
    const monday = new Date(now);
    const diff = day === 0 ? -6 : 1 - day; // shift to Monday
    monday.setDate(now.getDate() + diff + weekOffset * 7);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const fmt = (d) =>
      d.toLocaleDateString('en-GB', {
        month: 'short',
        day: 'numeric',
      });

    return `${fmt(monday)} – ${fmt(sunday)}`;
  };

  return (
    <div className="fade-up">
      <StatsGrid cols={3}>
        <StatCard label="Total Staff" value={staff.length} />
        <StatCard label="On Shift" value={onShiftCount} valueColor="#4caf7a" />
        <StatCard
          label="Day Off"
          value={dayOffCount}
          valueColor="rgba(245,240,232,0.4)"
        />
      </StatsGrid>

      {/* Staff Onboard (add new staff) */}
      <Panel
        title="Staff Onboard"
        action={
          <Btn onClick={() => setShowOnboard((v) => !v)}>
            {showOnboard ? 'Close' : 'Open'}
          </Btn>
        }
      >
        {showOnboard && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange(setForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            />
            <input
              name="role"
              placeholder="Role (e.g. BARISTA)"
              value={form.role}
              onChange={handleChange(setForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            />
            <select
              name="type"
              value={form.type}
              onChange={handleChange(setForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            >
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Intern">Intern</option>
            </select>
            <select
              name="status"
              value={form.status}
              onChange={handleChange(setForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            >
              <option value="On Shift">On Shift</option>
              <option value="Day Off">Day Off</option>
            </select>
            <input
              name="since"
              placeholder="Since (e.g. Mar 2021)"
              value={form.since}
              onChange={handleChange(setForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            />
            <input
              name="hours"
              placeholder="Weekly hours (e.g. 45h)"
              value={form.hours}
              onChange={handleChange(setForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            />
            <input
              name="schedule"
              placeholder="Mon–Sun (comma separated, e.g. 09–18,09–18,…)"
              value={form.schedule}
              onChange={handleChange(setForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
                gridColumn: 'span 3',
              }}
            />
            <label style={{ gridColumn: 'span 3', fontFamily: T.mono, fontSize: '0.72rem', color: 'rgba(245,240,232,0.7)' }}>
              Profile photo (upload)
            </label>
            <input
              ref={formPhotoRef}
              type="file"
              accept="image/*"
              style={{
                gridColumn: 'span 3',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange(setForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            />
            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange(setForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            />
            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange(setForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            />
            <input
              name="emergencyContact"
              placeholder="Emergency contact"
              value={form.emergencyContact}
              onChange={handleChange(setForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
                gridColumn: 'span 2',
              }}
            />
            <input
              name="onboardedDoc"
              placeholder="Onboarded doc (optional description)"
              value={form.onboardedDoc}
              onChange={handleChange(setForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
                gridColumn: 'span 3',
              }}
            />
            <label style={{ gridColumn: 'span 3', fontFamily: T.mono, fontSize: '0.72rem', color: 'rgba(245,240,232,0.7)' }}>
              Onboarded document (upload PDF, doc, etc.)
            </label>
            <input
              ref={formDocRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,image/*"
              style={{
                gridColumn: 'span 3',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            />
          </div>
        )}
        {showOnboard && (
          <Btn disabled={saving} onClick={handleAddStaff}>
            {saving ? 'Saving…' : 'Add Staff'}
          </Btn>
        )}
      </Panel>

      {editingId && (
        <Panel title="Edit Staff Member">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <input
              name="name"
              placeholder="Name"
              value={editForm.name}
              onChange={handleChange(setEditForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            />
            <input
              name="role"
              placeholder="Role"
              value={editForm.role}
              onChange={handleChange(setEditForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            />
            <select
              name="type"
              value={editForm.type}
              onChange={handleChange(setEditForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            >
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Intern">Intern</option>
            </select>
            <select
              name="status"
              value={editForm.status}
              onChange={handleChange(setEditForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            >
              <option value="On Shift">On Shift</option>
              <option value="Day Off">Day Off</option>
            </select>
            <input
              name="since"
              placeholder="Since"
              value={editForm.since}
              onChange={handleChange(setEditForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            />
            <input
              name="hours"
              placeholder="Weekly hours"
              value={editForm.hours}
              onChange={handleChange(setEditForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            />
            <input
              name="schedule"
              placeholder="Mon–Sun (comma separated)"
              value={editForm.schedule}
              onChange={handleChange(setEditForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
                gridColumn: 'span 3',
              }}
            />
            <label style={{ gridColumn: 'span 3', fontFamily: T.mono, fontSize: '0.72rem', color: 'rgba(245,240,232,0.7)' }}>
              Profile photo (upload to replace)
            </label>
            <input
              ref={editPhotoRef}
              type="file"
              accept="image/*"
              style={{
                gridColumn: 'span 3',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            />
            <input
              name="email"
              placeholder="Email"
              value={editForm.email}
              onChange={handleChange(setEditForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            />
            <input
              name="phone"
              placeholder="Phone"
              value={editForm.phone}
              onChange={handleChange(setEditForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            />
            <input
              name="address"
              placeholder="Address"
              value={editForm.address}
              onChange={handleChange(setEditForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            />
            <input
              name="emergencyContact"
              placeholder="Emergency contact"
              value={editForm.emergencyContact}
              onChange={handleChange(setEditForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
                gridColumn: 'span 2',
              }}
            />
            <input
              name="onboardedDoc"
              placeholder="Onboarded doc"
              value={editForm.onboardedDoc}
              onChange={handleChange(setEditForm)}
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid rgba(245,240,232,0.16)',
                background: 'rgba(10,6,4,0.8)',
                color: '#f5f0e8',
                fontFamily: T.mono,
                fontSize: '0.78rem',
                gridColumn: 'span 3',
              }}
            />
            <label style={{ gridColumn: 'span 3', fontFamily: T.mono, fontSize: '0.72rem', color: 'rgba(245,240,232,0.7)' }}>
              Onboarded document (upload to replace)
            </label>
            <input
              ref={editDocRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,image/*"
              style={{
                gridColumn: 'span 3',
                fontFamily: T.mono,
                fontSize: '0.78rem',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn disabled={updating} onClick={handleUpdateStaff}>
              {updating ? 'Updating…' : 'Save Changes'}
            </Btn>
            <Btn onClick={cancelEdit}>Cancel</Btn>
          </div>
        </Panel>
      )}

      {/* Staff Profile (view details + onboarded doc) */}
      {profileStaff && (
        <Panel
          title={`${profileStaff.name} — Profile`}
          action={
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn onClick={() => { closeProfile(); startEdit(profileStaff); }}>
                Edit
              </Btn>
              <Btn onClick={closeProfile}>Close</Btn>
            </div>
          }
        >
          <div
            style={{
              display: 'grid',
              gap: 20,
              fontFamily: T.mono,
              fontSize: '0.8rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                paddingBottom: 16,
                borderBottom: '1px solid rgba(196,137,42,0.2)',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: profileStaff.color || T.adminAmber,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: T.display,
                  fontSize: '1.5rem',
                  color: T.adminBg,
                  overflow: 'hidden',
                }}
              >
                {profileStaff.photoUrl ? (
                  <img
                    src={profileStaff.photoUrl.startsWith('/') ? UPLOAD_BASE + profileStaff.photoUrl : profileStaff.photoUrl}
                    alt={profileStaff.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%',
                    }}
                  />
                ) : (
                  profileStaff.initial ||
                  (profileStaff.name ? profileStaff.name.charAt(0) : '?')
                )}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                  {profileStaff.name}
                </div>
                <div style={{ color: T.adminAmber, marginTop: 4 }}>
                  {profileStaff.role}
                </div>
                <div style={{ color: 'rgba(245,240,232,0.5)', marginTop: 6 }}>
                  {profileStaff.since && profileStaff.type
                    ? `Since ${profileStaff.since} · ${profileStaff.type}`
                    : profileStaff.since || profileStaff.type || '—'}
                </div>
                <div style={{ marginTop: 8 }}>
                  <Badge
                    type={
                      profileStaff.status === 'On Shift' ? 'ready' : 'wait'
                    }
                  >
                    {profileStaff.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 8,
                  color: T.adminAmber,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                }}
              >
                Work details
              </div>
              <div style={{ color: 'rgba(245,240,232,0.85)' }}>
                Weekly hours: {profileStaff.hours || '—'}
              </div>
              {Array.isArray(profileStaff.schedule) &&
                profileStaff.schedule.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    Schedule (Mon–Sun):{' '}
                    {profileStaff.schedule.map((d, i) => (
                      <span key={i}>
                        {d || '—'}
                        {i < 6 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                )}
            </div>

            <div>
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 8,
                  color: T.adminAmber,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                }}
              >
                Personal details
              </div>
              <div style={{ display: 'grid', gap: 6, color: 'rgba(245,240,232,0.85)' }}>
                <div>Email: {profileStaff.email || '—'}</div>
                <div>Phone: {profileStaff.phone || '—'}</div>
                <div>Address: {profileStaff.address || '—'}</div>
                <div>Emergency contact: {profileStaff.emergencyContact || '—'}</div>
              </div>
            </div>

            <div>
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 8,
                  color: T.adminAmber,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                }}
              >
                Onboarded document
              </div>
              <div
                style={{
                  background: 'rgba(10,6,4,0.6)',
                  border: '1px solid rgba(196,137,42,0.15)',
                  borderRadius: 8,
                  padding: 12,
                  color: 'rgba(245,240,232,0.9)',
                  whiteSpace: 'pre-wrap',
                  minHeight: 60,
                }}
              >
                {profileStaff.onboardedDoc || 'No onboarded document added.'}
              </div>
              {profileStaff.onboardedDocUrl && (
                <div style={{ marginTop: 8 }}>
                  <a
                    href={profileStaff.onboardedDocUrl.startsWith('/') ? UPLOAD_BASE + profileStaff.onboardedDocUrl : profileStaff.onboardedDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: T.adminAmber,
                      textDecoration: 'underline',
                      fontSize: '0.78rem',
                    }}
                  >
                    Open document link →
                  </a>
                </div>
              )}
            </div>
          </div>
        </Panel>
      )}

      {loading && (
        <p style={{ marginTop: 16, fontFamily: T.mono, fontSize: '0.8rem' }}>
          Loading staff...
        </p>
      )}
      {error && !loading && (
        <p
          style={{
            marginTop: 16,
            fontFamily: T.mono,
            fontSize: '0.8rem',
            color: '#e57373',
          }}
        >
          {error}
        </p>
      )}

      {/* Staff Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 14,
          marginBottom: 22,
          marginTop: 16,
        }}
      >
        {staff.map((st) => (
          <div
            key={st._id}
            onDoubleClick={(e) => {
              if (e.target.closest('button')) return;
              openProfile(st);
            }}
            style={{
              background: 'rgba(196,137,42,0.06)',
              border: '1px solid rgba(196,137,42,0.12)',
              borderRadius: 8,
              padding: 16,
              display: 'flex',
              gap: 12,
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: st.color || T.adminAmber,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: T.display,
                fontSize: '1.2rem',
                color: T.adminBg,
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              {st.photoUrl ? (
                <img
                  src={getMediaUrl(st.photoUrl)}
                  alt={st.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling?.style?.removeProperty('display');
                  }}
                />
              ) : null}
              <span style={{ display: st.photoUrl ? 'none' : undefined }}>
                {st.initial || (st.name ? st.name.charAt(0) : '?')}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                {st.name}
              </div>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: '0.53rem',
                  color: T.adminAmber,
                  marginTop: 3,
                }}
              >
                {st.role}
              </div>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: '0.56rem',
                  color: 'rgba(245,240,232,0.38)',
                  marginTop: 5,
                }}
              >
                {st.since && st.type
                  ? `Since ${st.since} · ${st.type}`
                  : st.since || st.type || ''}
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Badge type={st.status === 'On Shift' ? 'ready' : 'wait'}>
                  {st.status}
                </Badge>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); openProfile(st); }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: '1px solid rgba(196,137,42,0.4)',
                    background: 'rgba(196,137,42,0.12)',
                    color: T.adminAmber,
                    fontSize: '0.68rem',
                    cursor: 'pointer',
                    fontFamily: T.mono,
                  }}
                >
                  View Profile
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); startEdit(st); }}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                border: 'none',
                background: 'transparent',
                color: 'rgba(245,240,232,0.7)',
                fontSize: '0.7rem',
                cursor: 'pointer',
                fontFamily: T.mono,
              }}
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Weekly Schedule */}
      <Panel
        title="Weekly Schedule"
        action={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Btn onClick={() => setWeekOffset((v) => v - 1)}>{'<'}</Btn>
            <span
              style={{
                fontFamily: T.mono,
                fontSize: '0.7rem',
                color: 'rgba(245,240,232,0.8)',
              }}
            >
              {getWeekLabel()}
            </span>
            <Btn onClick={() => setWeekOffset((v) => v + 1)}>{'>'}</Btn>
          </div>
        }
      >
        <Tbl
          headers={[
            'Staff',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
            'Sun',
            'Hours',
          ]}
        >
          {staff.map((st) => {
            const days = Array.isArray(st.schedule)
              ? st.schedule
              : ['—', '—', '—', '—', '—', '—', '—'];

            const paddedDays =
              days.length >= 7
                ? days.slice(0, 7)
                : [...days, ...Array(7 - days.length).fill('—')];

            return (
              <tr key={st._id}>
                <Td bold>{st.name}</Td>
                {paddedDays.map((d, j) => (
                  <Td key={j}>
                    {d === '—' || !d ? (
                      <span
                        style={{
                          fontFamily: T.mono,
                          fontSize: '0.62rem',
                          color: 'rgba(245,240,232,0.2)',
                        }}
                      >
                        —
                      </span>
                    ) : (
                      <Badge type={j >= 5 ? 'prep' : 'ready'}>{d}</Badge>
                    )}
                  </Td>
                ))}
                <Td amber>{st.hours || '—'}</Td>
              </tr>
            );
          })}
        </Tbl>
      </Panel>
    </div>
  );
}