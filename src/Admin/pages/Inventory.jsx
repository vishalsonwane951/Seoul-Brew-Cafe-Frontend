import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Panel, StatCard, StatsGrid, Btn, Badge, Tbl, Td, ProgressBar } from '../components/AdminUI';
import { Modal, FormGroup, inputStyle, selectStyle } from '../components/SharedUI';
import { T } from '../globalstyle';

const INVENTORY = [
  { icon:'☕', name:'Espresso Beans (Seoul Roast)', detail:'8.2kg / Min 5kg',   pct: 80, status:'good' },
  { icon:'🍵', name:'Jeju Matcha Powder',           detail:'1.1kg / Min 1kg',   pct: 22, status:'low'  },
  { icon:'🥛', name:'Whole Milk',                    detail:'24L / Min 10L',     pct: 70, status:'good' },
  { icon:'🥛', name:'Oat Milk',                      detail:'6L / Min 5L',       pct: 30, status:'warn' },
  { icon:'🍮', name:'Dalgona Mix',                   detail:'2.3kg / Min 1kg',   pct: 60, status:'good' },
  { icon:'🧇', name:'Waffle Mix',                    detail:'3.5kg / Min 2kg',   pct: 75, status:'good' },
  { icon:'🥚', name:'Eggs (free-range)',             detail:'24pcs / Min 30',    pct: 15, status:'low'  },
  { icon:'🍓', name:'Strawberry Puree',             detail:'0.8L / Min 1L',     pct:  0, status:'out'  },
  { icon:'🍞', name:'Bread Loaves',                  detail:'8pcs / Min 5',      pct: 60, status:'good' },
  { icon:'🧈', name:'Butter (Korean)',               detail:'1.2kg / Min 0.5kg', pct: 85, status:'good' },
];

const SUPPLIER_ORDERS = [
  { date:'Feb 20', supplier:'Seoul Roasters Co.',  items:'Espresso Beans 10kg',          total:'₹85,000', status:'Delivered'  },
  { date:'Feb 19', supplier:'Jeju Green Tea Farm', items:'Matcha 2kg',                   total:'₹60,000', status:'In Transit' },
  { date:'Feb 18', supplier:'Maeil Dairy',          items:'Whole Milk 50L, Oat Milk 20L', total:'₹45,000', status:'Delivered'  },
];

const STATUS_COLOR = { good:'#4caf7a', warn: T.adminAmber, low:'#e05555', out:'#e05555' };
const STATUS_LABEL = { good:'Good', warn:'Order Soon', low:'Low!', out:'Out!' };

function InvItem({ item, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0',
      borderBottom: last ? 'none' : '1px solid rgba(245,240,232,0.06)',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 6, flexShrink: 0,
        background: 'rgba(196,137,42,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
      }}>
        {item.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{item.name}</div>
        <div style={{ fontFamily: T.mono, fontSize: '0.57rem', color: 'rgba(245,240,232,0.38)', marginTop: 2 }}>
          {item.detail}
        </div>
      </div>
      <div style={{ width: 90 }}>
        <ProgressBar value={item.pct} color={STATUS_COLOR[item.status]} />
        <div style={{ fontFamily: T.mono, fontSize: '0.5rem', color: STATUS_COLOR[item.status], marginTop: 4 }}>
          {STATUS_LABEL[item.status]}
        </div>
      </div>
    </div>
  );
}

export default function Inventory() {
  const { showToast } = useApp();
  const [orderOpen, setOrderOpen] = useState(false);

  const coffee = INVENTORY.slice(0, 5);
  const food   = INVENTORY.slice(5);

  return (
    <div className="fade-up">
      <StatsGrid>
        <StatCard label="Total Items"     value={INVENTORY.length} />
        <StatCard label="Low Stock"       value={INVENTORY.filter(i => i.status === 'low').length}  valueColor="#e05555" />
        <StatCard label="Out of Stock"    value={INVENTORY.filter(i => i.status === 'out').length}  valueColor="#8b2020" />
        <StatCard label="Reorder Needed"  value={INVENTORY.filter(i => i.status !== 'good').length} valueColor={T.adminAmber} />
      </StatsGrid>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <Panel
          title="Coffee & Ingredients"
          action={
            <Btn variant="primary" size="sm" onClick={() => showToast('Orders placed!')}>
              Order All Low
            </Btn>
          }
        >
          {coffee.map((item, i) => <InvItem key={i} item={item} last={i === coffee.length - 1} />)}
        </Panel>

        <Panel title="Food & Bakery">
          {food.map((item, i) => <InvItem key={i} item={item} last={i === food.length - 1} />)}
        </Panel>
      </div>

      <Panel
        title="Supplier Order History"
        action={<Btn variant="primary" onClick={() => setOrderOpen(true)}>+ New Order</Btn>}
      >
        <Tbl headers={['Date','Supplier','Items','Total','Status']}>
          {SUPPLIER_ORDERS.map((o, i) => (
            <tr key={i}>
              <Td mono>{o.date}</Td>
              <Td bold>{o.supplier}</Td>
              <Td mono>{o.items}</Td>
              <Td amber>{o.total}</Td>
              <Td><Badge type={o.status === 'Delivered' ? 'ready' : 'prep'}>{o.status}</Badge></Td>
            </tr>
          ))}
        </Tbl>
      </Panel>

      <Modal title="New Supplier Order" open={orderOpen} onClose={() => setOrderOpen(false)}>
        <FormGroup label="Supplier">
          <select style={selectStyle()}>
            <option>Seoul Roasters Co.</option>
            <option>Jeju Green Tea Farm</option>
            <option>Maeil Dairy</option>
            <option>Other</option>
          </select>
        </FormGroup>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <FormGroup label="Item"><input style={inputStyle()} placeholder="e.g. Espresso Beans" /></FormGroup>
          <FormGroup label="Quantity"><input style={inputStyle()} placeholder="e.g. 10kg" /></FormGroup>
          <FormGroup label="Est. Cost (₹)"><input style={inputStyle()} type="number" placeholder="85000" /></FormGroup>
          <FormGroup label="Delivery Date"><input type="date" style={inputStyle()} /></FormGroup>
        </div>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:16 }}>
          <Btn variant="ghost" onClick={() => setOrderOpen(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={() => { showToast('Order submitted!'); setOrderOpen(false); }}>Place Order</Btn>
        </div>
      </Modal>
    </div>
  );
}