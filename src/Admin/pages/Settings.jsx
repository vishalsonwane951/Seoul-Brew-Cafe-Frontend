import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Panel, Btn, Toggle, Tbl, Td, Badge } from '../components/AdminUI';
import { Modal, FormGroup, inputStyle, selectStyle } from '../components/SharedUI';
import { T } from '../globalstyle';

const ADMIN_ACCOUNTS = [
  { name:'Jiyeon Park', role:'Manager',     last:'Now',    isYou:true  },
  { name:'Minjun Kim',  role:'Barista Lead', last:'2h ago', isYou:false },
  { name:'Owner',       role:'Super Admin',  last:'Feb 20', isYou:false },
];

function SettingRow({ label, desc, field, state, setState }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'13px 0', borderBottom:'1px solid rgba(245,240,232,0.07)',
    }}>
      <div>
        <div style={{ fontSize:'0.84rem' }}>{label}</div>
        <div style={{ fontFamily: T.mono, fontSize:'0.54rem', color:'rgba(245,240,232,0.33)', marginTop:3 }}>{desc}</div>
      </div>
      <Toggle on={state[field]} onChange={v => setState(p => ({ ...p, [field]: v }))} />
    </div>
  );
}

export default function Settings() {
  const { showToast } = useApp();

  const [cafeInfo, setCafeInfo] = useState({
    name:      'Seoul Brew Cafe',
    address:   '서울시 마포구 홍대입구로 23, 2F',
    openTime:  '08:00',
    closeTime: '22:00',
    phone:     '02-1234-5678',
    instagram: '@seoulbrewcafe',
  });

  const [notifs, setNotifs] = useState({
    newOrder:    true,
    lowInv:      true,
    resMinder:   true,
    reviews:     false,
    dailyReport: true,
  });

  const [pos, setPos] = useState({
    autoPrint:   true,
    taxIncluded: true,
    tableMode:   true,
    orderNotes:  true,
  });

  const [taxRate,       setTaxRate]       = useState('10');
  const [addAdminOpen,  setAddAdminOpen]  = useState(false);

  const updateCafe = (k, v) => setCafeInfo(p => ({ ...p, [k]: v }));

  return (
    <div className="fade-up">

      {/* Row 1: Cafe Info + Notifications */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>

        {/* Cafe Information */}
        <Panel title="Cafe Information">
          {[
            ['Cafe Name', 'name',      'text'],
            ['Address',   'address',   'text'],
            ['Phone',     'phone',     'tel' ],
            ['Instagram', 'instagram', 'text'],
          ].map(([label, key, type]) => (
            <FormGroup key={key} label={label}>
              <input
                style={inputStyle()}
                type={type}
                value={cafeInfo[key]}
                onChange={e => updateCafe(key, e.target.value)}
              />
            </FormGroup>
          ))}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <FormGroup label="Open Time">
              <input type="time" style={inputStyle()} value={cafeInfo.openTime}  onChange={e => updateCafe('openTime',  e.target.value)} />
            </FormGroup>
            <FormGroup label="Close Time">
              <input type="time" style={inputStyle()} value={cafeInfo.closeTime} onChange={e => updateCafe('closeTime', e.target.value)} />
            </FormGroup>
          </div>
          <Btn variant="primary" onClick={() => showToast('Cafe info saved!')}>Save Changes</Btn>
        </Panel>

        {/* Notifications */}
        <Panel title="Notifications">
          <SettingRow label="New Order Alert"        desc="Sound + push on new order"        field="newOrder"    state={notifs} setState={setNotifs} />
          <SettingRow label="Low Inventory Alert"    desc="Notify when stock below minimum"  field="lowInv"      state={notifs} setState={setNotifs} />
          <SettingRow label="Reservation Reminders"  desc="30 min before reservation"        field="resMinder"   state={notifs} setState={setNotifs} />
          <SettingRow label="New Reviews"            desc="Notify when new review posted"    field="reviews"     state={notifs} setState={setNotifs} />
          <SettingRow label="Daily Revenue Report"   desc="Email report at end of day"       field="dailyReport" state={notifs} setState={setNotifs} />
          <div style={{ marginTop:16 }}>
            <Btn variant="primary" onClick={() => showToast('Notification settings saved!')}>Save Preferences</Btn>
          </div>
        </Panel>
      </div>

      {/* Row 2: POS + Admin Accounts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>

        {/* POS Settings */}
        <Panel title="POS Settings">
          <SettingRow label="Auto-print Receipts"  desc="Print receipt for every order"     field="autoPrint"   state={pos} setState={setPos} />
          <SettingRow label="Tax Included Pricing"  desc="Show VAT-included prices on menu"  field="taxIncluded" state={pos} setState={setPos} />
          <SettingRow label="Table Service Mode"    desc="Enable table-based ordering"       field="tableMode"   state={pos} setState={setPos} />
          <SettingRow label="Allow Order Notes"     desc="Customers can add custom notes"    field="orderNotes"  state={pos} setState={setPos} />
          <FormGroup label="Tax Rate (%)">
            <input
              style={{ ...inputStyle(), width:100 }}
              type="number"
              value={taxRate}
              onChange={e => setTaxRate(e.target.value)}
            />
          </FormGroup>
          <Btn variant="primary" onClick={() => showToast('POS settings saved!')}>Save</Btn>
        </Panel>

        {/* Admin Accounts */}
        <Panel title="Admin Accounts" action={
          <Btn variant="ghost" onClick={() => setAddAdminOpen(true)}>+ Add Admin</Btn>
        }>
          <Tbl headers={['Name','Role','Last Login','Action']}>
            {ADMIN_ACCOUNTS.map((a, i) => (
              <tr key={i}>
                <Td bold>{a.name}</Td>
                <Td mono>{a.role}</Td>
                <Td mono>{a.last}</Td>
                <Td>
                  {a.isYou
                    ? <Badge type="ready">You</Badge>
                    : <Btn variant="ghost" size="sm" onClick={() => showToast('Edit admin…')}>Edit</Btn>
                  }
                </Td>
              </tr>
            ))}
          </Tbl>
        </Panel>
      </div>

      {/* Danger Zone */}
      <Panel title="⚠ Danger Zone">
        {[
          ['Clear All Orders',  'Permanently delete all order history from the system'],
          ['Reset Dashboard',   'Reset all settings and data to factory defaults'],
        ].map(([label, desc]) => (
          <div key={label} style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'14px 0', borderBottom:'1px solid rgba(245,240,232,0.07)',
          }}>
            <div>
              <div style={{ fontSize:'0.84rem' }}>{label}</div>
              <div style={{ fontFamily: T.mono, fontSize:'0.54rem', color:'rgba(245,240,232,0.33)', marginTop:3 }}>{desc}</div>
            </div>
            <Btn
              variant="danger"
              onClick={() => {
                if (window.confirm(`Are you sure you want to ${label.toLowerCase()}?`)) {
                  showToast(`${label} completed.`);
                }
              }}
            >
              {label}
            </Btn>
          </div>
        ))}
      </Panel>

      {/* Add Admin Modal */}
      <Modal title="Add Admin Account" open={addAdminOpen} onClose={() => setAddAdminOpen(false)}>
        <FormGroup label="Full Name">
          <input style={inputStyle()} placeholder="e.g. Soohyun Lee" />
        </FormGroup>
        <FormGroup label="Email">
          <input type="email" style={inputStyle()} placeholder="staff@seoulbrew.com" />
        </FormGroup>
        <FormGroup label="Role">
          <select style={selectStyle()}>
            <option>Barista Lead</option>
            <option>Server Lead</option>
            <option>Kitchen Lead</option>
            <option>Manager</option>
          </select>
        </FormGroup>
        <FormGroup label="Temp Password">
          <input type="password" style={inputStyle()} placeholder="Set temporary password" />
        </FormGroup>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:16 }}>
          <Btn variant="ghost" onClick={() => setAddAdminOpen(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={() => { showToast('Admin account created!'); setAddAdminOpen(false); }}>
            Create Account
          </Btn>
        </div>
      </Modal>
    </div>
  );
}