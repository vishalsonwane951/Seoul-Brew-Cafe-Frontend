import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Panel, StatCard, StatsGrid, Btn, Badge, Tbl, Td, ProgressBar } from '../components/AdminUI';
import { Modal, FormGroup, inputStyle, selectStyle } from '../components/SharedUI';
import { T } from '../globalstyle';
import API from '../../services/api';
import { socket } from '../../Soket';

const STATUS_COLOR = { good: '#4caf7a', warn: T.adminAmber, low: '#e05555', out: '#e05555' };
const STATUS_LABEL = { good: 'Good', warn: 'Order Soon', low: 'Low!', out: 'Out!' };

function InvItem({ item, last, onEditStock }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 0',
        borderBottom: last ? 'none' : '1px solid rgba(245,240,232,0.06)',
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 6,
          flexShrink: 0,
          background: 'rgba(196,137,42,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
        }}
      >
        {item.icon || '📦'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{item.name}</div>
        <div
          style={{
            fontFamily: T.mono,
            fontSize: '0.57rem',
            color: 'rgba(245,240,232,0.38)',
            marginTop: 2,
          }}
        >
          {item.detail}
        </div>
      </div>
      <div style={{ width: 90 }}>
        <ProgressBar value={item.pct} color={STATUS_COLOR[item.status]} />
        <div
          style={{
            fontFamily: T.mono,
            fontSize: '0.5rem',
            color: STATUS_COLOR[item.status],
            marginTop: 4,
          }}
        >
          {STATUS_LABEL[item.status]}
        </div>
      </div>
      {onEditStock && (
        <button
          type="button"
          onClick={() => onEditStock(item)}
          style={{
            padding: '4px 8px',
            fontSize: '0.65rem',
            fontFamily: T.mono,
            border: '1px solid rgba(196,137,42,0.4)',
            background: 'rgba(196,137,42,0.1)',
            color: T.adminAmber,
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Update
        </button>
      )}
    </div>
  );
}

export default function Inventory() {
  const { showToast, user } = useApp();
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderOpen, setOrderOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editStockItem, setEditStockItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const [orderForm, setOrderForm] = useState({
    supplier: 'Seoul Roasters Co.',
    items: '',
    total: '',
    deliveryDate: '',
  });
  const [itemForm, setItemForm] = useState({
    name: '',
    icon: '📦',
    category: 'coffee',
    currentQty: 0,
    unit: 'kg',
    minQty: 1,
  });
  const [stockForm, setStockForm] = useState({ currentQty: '' });

  const token = user?.token || localStorage.getItem('token');

  const fetchInventory = async () => {
    if (!token) return;
    try {
      const res = await API.get('/inventory', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventory(res.data || []);
    } catch (err) {
      showToast('Failed to load inventory');
    }
  };

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await API.get('/inventory/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (err) {
      showToast('Failed to load orders');
    }
  };

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([fetchInventory(), fetchOrders()]).finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    socket.on('inventory:refresh', fetchInventory);
    socket.on('supplierOrders:refresh', fetchOrders);
    return () => {
      socket.off('inventory:refresh', fetchInventory);
      socket.off('supplierOrders:refresh', fetchOrders);
    };
  }, [token]);

  const coffee = inventory.filter((i) => i.category === 'coffee');
  const food = inventory.filter((i) => i.category === 'food');

  const lowItems = inventory.filter((i) => i.status === 'low' || i.status === 'out');

  const handleOrderAllLow = async () => {
    if (!lowItems.length) {
      showToast('No low-stock items to order');
      return;
    }
    if (!token) return;
    setSaving(true);
    try {
      const itemsText = lowItems.map((i) => `${i.name} (reorder)`).join(', ');
      await API.post(
        '/inventory/orders',
        {
          date: new Date().toISOString().slice(0, 10),
          supplier: 'Seoul Roasters Co.',
          items: itemsText,
          total: '—',
          status: 'Pending',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('Reorder placed for low-stock items!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSaving(false);
    }
  };

  const handleNewOrder = async () => {
    if (!orderForm.items || !orderForm.total) {
      showToast('Items and total are required');
      return;
    }
    if (!token) return;
    setSaving(true);
    try {
      await API.post(
        '/inventory/orders',
        {
          date: new Date().toISOString().slice(0, 10),
          supplier: orderForm.supplier,
          items: orderForm.items,
          total: orderForm.total,
          deliveryDate: orderForm.deliveryDate || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('Order submitted!');
      setOrderOpen(false);
      setOrderForm({ supplier: 'Seoul Roasters Co.', items: '', total: '', deliveryDate: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit order');
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = async () => {
    if (!itemForm.name || itemForm.minQty == null) {
      showToast('Name and min quantity required');
      return;
    }
    if (!token) return;
    setSaving(true);
    try {
      await API.post('/inventory', itemForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Item added!');
      setAddItemOpen(false);
      setItemForm({ name: '', icon: '📦', category: 'coffee', currentQty: 0, unit: 'kg', minQty: 1 });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add item');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!editStockItem || stockForm.currentQty === '') return;
    if (!token) return;
    setSaving(true);
    try {
      await API.patch(
        `/inventory/${editStockItem._id}/stock`,
        { currentQty: Number(stockForm.currentQty) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('Stock updated!');
      setEditStockItem(null);
      setStockForm({ currentQty: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update stock');
    } finally {
      setSaving(false);
    }
  };

  const openEditStock = (item) => {
    setEditStockItem(item);
    setStockForm({ currentQty: String(item.currentQty) });
  };

  const lowCount = inventory.filter((i) => i.status === 'low').length;
  const outCount = inventory.filter((i) => i.status === 'out').length;
  const reorderCount = inventory.filter((i) => i.status !== 'good').length;

  return (
    <div className="fade-up">
      <StatsGrid>
        <StatCard label="Total Items" value={inventory.length} />
        <StatCard label="Low Stock" value={lowCount} valueColor="#e05555" />
        <StatCard label="Out of Stock" value={outCount} valueColor="#8b2020" />
        <StatCard label="Reorder Needed" value={reorderCount} valueColor={T.adminAmber} />
      </StatsGrid>

      {loading && (
        <p style={{ fontFamily: T.mono, fontSize: '0.8rem', marginTop: 12 }}>Loading inventory…</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Panel
          title="Coffee & Ingredients"
          action={
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn variant="primary" size="sm" onClick={handleOrderAllLow} disabled={saving || !lowItems.length}>
                Order All Low
              </Btn>
              <Btn variant="primary" size="sm" onClick={() => setAddItemOpen(true)}>
                + Add Item
              </Btn>
            </div>
          }
        >
          {coffee.length === 0 && !loading ? (
            <p style={{ fontFamily: T.mono, fontSize: '0.72rem', color: 'rgba(245,240,232,0.4)' }}>
              No coffee items. Add one above.
            </p>
          ) : (
            coffee.map((item, i) => (
              <InvItem
                key={item._id}
                item={item}
                last={i === coffee.length - 1}
                onEditStock={openEditStock}
              />
            ))
          )}
        </Panel>

        <Panel
          title="Food & Bakery"
          action={
            <Btn variant="primary" size="sm" onClick={() => setAddItemOpen(true)}>
              + Add Item
            </Btn>
          }
        >
          {food.length === 0 && !loading ? (
            <p style={{ fontFamily: T.mono, fontSize: '0.72rem', color: 'rgba(245,240,232,0.4)' }}>
              No food items. Add one above.
            </p>
          ) : (
            food.map((item, i) => (
              <InvItem
                key={item._id}
                item={item}
                last={i === food.length - 1}
                onEditStock={openEditStock}
              />
            ))
          )}
        </Panel>
      </div>

      <Panel
        title="Supplier Order History"
        action={
          <Btn variant="primary" onClick={() => setOrderOpen(true)}>
            + New Order
          </Btn>
        }
      >
        <Tbl headers={['Date', 'Supplier', 'Items', 'Total', 'Status']}>
          {orders.length === 0 && !loading ? (
            <tr>
              <td colSpan={5} style={{ fontFamily: T.mono, fontSize: '0.72rem', color: 'rgba(245,240,232,0.4)', padding: 16 }}>
                No orders yet.
              </td>
            </tr>
          ) : (
            orders.map((o) => (
              <tr key={o._id}>
                <Td mono>{o.date}</Td>
                <Td bold>{o.supplier}</Td>
                <Td mono>{o.items}</Td>
                <Td amber>{o.total}</Td>
                <Td>
                  <Badge type={o.status === 'Delivered' ? 'ready' : o.status === 'In Transit' ? 'prep' : 'wait'}>
                    {o.status}
                  </Badge>
                </Td>
              </tr>
            ))
          )}
        </Tbl>
      </Panel>

      <Modal title="New Supplier Order" open={orderOpen} onClose={() => setOrderOpen(false)}>
        <FormGroup label="Supplier">
          <select
            style={selectStyle()}
            value={orderForm.supplier}
            onChange={(e) => setOrderForm((p) => ({ ...p, supplier: e.target.value }))}
          >
            <option>Seoul Roasters Co.</option>
            <option>Jeju Green Tea Farm</option>
            <option>Maeil Dairy</option>
            <option>Other</option>
          </select>
        </FormGroup>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormGroup label="Item">
            <input
              style={inputStyle()}
              placeholder="e.g. Espresso Beans 10kg"
              value={orderForm.items}
              onChange={(e) => setOrderForm((p) => ({ ...p, items: e.target.value }))}
            />
          </FormGroup>
          <FormGroup label="Quantity / description">
            <input style={inputStyle()} placeholder="e.g. 10kg" />
          </FormGroup>
          <FormGroup label="Est. Cost (₹)">
            <input
              style={inputStyle()}
              type="text"
              placeholder="85000"
              value={orderForm.total}
              onChange={(e) => setOrderForm((p) => ({ ...p, total: e.target.value }))}
            />
          </FormGroup>
          <FormGroup label="Delivery Date">
            <input
              type="date"
              style={inputStyle()}
              value={orderForm.deliveryDate}
              onChange={(e) => setOrderForm((p) => ({ ...p, deliveryDate: e.target.value }))}
            />
          </FormGroup>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <Btn variant="ghost" onClick={() => setOrderOpen(false)}>
            Cancel
          </Btn>
          <Btn variant="primary" onClick={handleNewOrder} disabled={saving}>
            Place Order
          </Btn>
        </div>
      </Modal>

      <Modal title="Add Inventory Item" open={addItemOpen} onClose={() => setAddItemOpen(false)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormGroup label="Name">
            <input
              style={inputStyle()}
              placeholder="e.g. Espresso Beans"
              value={itemForm.name}
              onChange={(e) => setItemForm((p) => ({ ...p, name: e.target.value }))}
            />
          </FormGroup>
          <FormGroup label="Icon (emoji)">
            <input
              style={inputStyle()}
              placeholder="☕"
              value={itemForm.icon}
              onChange={(e) => setItemForm((p) => ({ ...p, icon: e.target.value || '📦' }))}
            />
          </FormGroup>
          <FormGroup label="Category">
            <select
              style={selectStyle()}
              value={itemForm.category}
              onChange={(e) => setItemForm((p) => ({ ...p, category: e.target.value }))}
            >
              <option value="coffee">Coffee & Ingredients</option>
              <option value="food">Food & Bakery</option>
            </select>
          </FormGroup>
          <FormGroup label="Unit">
            <select
              style={selectStyle()}
              value={itemForm.unit}
              onChange={(e) => setItemForm((p) => ({ ...p, unit: e.target.value }))}
            >
              <option value="kg">kg</option>
              <option value="L">L</option>
              <option value="pcs">pcs</option>
            </select>
          </FormGroup>
          <FormGroup label="Current Qty">
            <input
              style={inputStyle()}
              type="number"
              min="0"
              value={itemForm.currentQty}
              onChange={(e) => setItemForm((p) => ({ ...p, currentQty: Number(e.target.value) || 0 }))}
            />
          </FormGroup>
          <FormGroup label="Min Qty (reorder below this)">
            <input
              style={inputStyle()}
              type="number"
              min="0"
              value={itemForm.minQty}
              onChange={(e) => setItemForm((p) => ({ ...p, minQty: Number(e.target.value) || 1 }))}
            />
          </FormGroup>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <Btn variant="ghost" onClick={() => setAddItemOpen(false)}>
            Cancel
          </Btn>
          <Btn variant="primary" onClick={handleAddItem} disabled={saving}>
            Add Item
          </Btn>
        </div>
      </Modal>

      <Modal
        title="Update Stock"
        open={!!editStockItem}
        onClose={() => { setEditStockItem(null); setStockForm({ currentQty: '' }); }}
      >
        {editStockItem && (
          <>
            <p style={{ fontFamily: T.mono, fontSize: '0.72rem', marginBottom: 12 }}>
              {editStockItem.name} — current: {editStockItem.currentQty}{editStockItem.unit}
            </p>
            <FormGroup label="New quantity">
              <input
                style={inputStyle()}
                type="number"
                min="0"
                value={stockForm.currentQty}
                onChange={(e) => setStockForm({ currentQty: e.target.value })}
              />
            </FormGroup>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
              <Btn variant="ghost" onClick={() => setEditStockItem(null)}>
                Cancel
              </Btn>
              <Btn variant="primary" onClick={handleUpdateStock} disabled={saving}>
                Update
              </Btn>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
