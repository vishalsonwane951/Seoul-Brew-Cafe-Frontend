import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Panel, StatCard, StatsGrid, Btn, Badge, Tbl, Td } from '../components/AdminUI';
import { Modal, inputStyle,selectStyle } from '../components/SharedUI';
import { T } from '../globalstyle';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const STATUS_NEXT = { Accepted: 'Preparing', Preparing: 'Ready', Ready: 'Served', 'Out for Delivery': 'Delivered', 'Picked Up': 'Done' };
const BADGE_TYPE = { Accepted: 'wait', Preparing: 'prep', Ready: 'ready', Served: 'done', Cancelled: 'cancelled', 'Out for Delivery': 'prep', 'Picked Up': 'ready' };

export default function Orders() {
  const { role, loading } = useAuth();
  const { orders, setOrders, showToast } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [viewOrder, setViewOrder] = useState(null);

  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  console.log("viewOrder state:", viewOrder);

  useEffect(() => {
  if (loading) return;
  if (!user || !token) return;

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err.response || err);
      showToast?.("Failed to load orders");
    }
  };

  // Fetch immediately on mount
  fetchOrders();

  // Set interval to fetch every 2 seconds (2000ms)
  const interval = setInterval(fetchOrders, 2000);

  // Cleanup on unmount
  return () => clearInterval(interval);
}, [user, token, role, loading, setOrders]);

  const filtered = (orders || []).filter(o => {
    if (!o || !(o._id || o.id)) return false; // skip invalid
    const statusMatch = filter === 'all' || (o.status && o.status.toLowerCase() === filter);
    const searchMatch =
      (o.customer && o.customer.toLowerCase().includes(search.toLowerCase())) ||
      (Array.isArray(o.items) && o.items.toString().toLowerCase().includes(search.toLowerCase()));
    return statusMatch && searchMatch;
  });

  const advance = async (id) => {
    if (!id) {
      showToast("Cannot advance: invalid order ID");
      return;
    }
    try {
      const res = await API.patch(`/orders/${id}/advance`,{},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('admin token', token)

      // ✅ Update correct order in state
      setOrders(prev =>
        prev.map(order =>
          order._id === id
            ? {
              ...order,
              status: res.data.status,
              statusTimestamps: res.data.statusTimestamps,
              updatedAt: res.data.updatedAt,
            }
            : order
        )
      );

      showToast("Order status updated!");

    } catch (err) {
      console.error("Advance error:", err.response?.data || err.message);

      showToast(
        err.response?.data?.message ||
        "Failed to advance order"
      );
    }
  };

  const cancelOrder = async (id) => {
    if (!id) return showToast("Cannot cancel: invalid order ID");
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await API.patch(`/orders/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(prev => prev.map(o => o._id !== id ? o : res.data));
      showToast('Order cancelled successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  return (
    <div className="fade-up">
      <StatsGrid>
        <StatCard label="Waiting" value={(orders || []).filter(o => o.status === 'Accepted').length} valueColor="#e08a30" />
        <StatCard label="Preparing" value={(orders || []).filter(o => o.status === 'Preparing').length} valueColor={T.adminAmber} />
        <StatCard label="Ready" value={(orders || []).filter(o => o.status === 'Ready').length} valueColor="#4caf7a" />
        <StatCard label="Done Today" value={(orders || []).filter(o => ['Served', 'Delivered', 'Picked Up'].includes(o.status)).length} />
      </StatsGrid>

      <Panel title="All Orders" action={
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select style={{ ...selectStyle(), width: 140, padding: '6px 10px' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            {['accepted', 'preparing', 'ready', 'served', 'cancelled'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <input style={{ ...inputStyle(), width: 200 }} placeholder="Search orders…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      }>
        <Tbl headers={['#', 'Customer', 'Items', 'Total', 'Time', 'Status', 'Actions']}>
          {filtered.map((o) => {
            const id = o._id || o.id || 'unknown';
            const customerName = o.customer || 'N/A';
            const items = Array.isArray(o.items) ? o.items.map(i => `${i.title || 'Item'} x${i.quantity || 1}`).join(', ') : o.items || '-';
            const total = o.total != null ? Number(o.total).toLocaleString() : '0';
            const orderTime = o.orderPlacedAt ? new Date(o.orderPlacedAt).toLocaleTimeString() : '-';
            const status = o.status || 'Pending';

            return (
              <tr key={id} onClick={() => setViewOrder(o)}>
                <Td amber>#{id !== 'unknown' ? id.slice(-5) : '-----'}</Td>
                <Td bold>{customerName}</Td>
                <Td mono>{items}</Td>
                <Td amber>₹{total}</Td>
                <Td mono>{orderTime}</Td>
                <Td>
                  <Badge type={BADGE_TYPE[status] || 'wait'}>{status}</Badge>
                </Td>
                <Td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {status !== 'Served' && status !== 'Delivered' && status !== 'Picked Up' && status !== 'Cancelled' ? (
                      <>
                        <Btn
                          variant={status === 'Accepted' ? 'primary' : 'success'}
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); advance(id); }}
                        >
                          {STATUS_NEXT[status] || 'Accept'}
                        </Btn>
                        <Btn
                          variant="danger"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); cancelOrder(id); }}
                        >
                          Cancel
                        </Btn>
                      </>
                    ) : (
                      <Btn
                        variant="success"
                        size="sm"
                        disabled
                      >
                        Done
                      </Btn>
                    )}
                    <Btn variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setViewOrder(o); }}>
                      View
                    </Btn>
                  </div>
                </Td>
              </tr>
            );
          })}
        </Tbl>
      </Panel>

      <Modal
        title={`Order #${viewOrder?.id?.slice(-5) || ""}`}
        open={Boolean(viewOrder)}
        onClose={() => setViewOrder(null)}
      >
        {viewOrder && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                background: "rgba(196,137,42,0.06)",
                border: `1px solid rgba(196,137,42,0.15)`,
                borderRadius: 6,
                padding: 16,
              }}
            >
              {/* CUSTOMER */}
              <div>
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: "0.5rem",
                    color: "rgba(245,240,232,0.35)",
                    marginBottom: 4,
                  }}
                >
                  CUSTOMER
                </div>
                <b>{viewOrder?.customer || "N/A"}</b>
              </div>

              {/* TABLE */}
              <div>
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: "0.5rem",
                    color: "rgba(245,240,232,0.35)",
                    marginBottom: 4,
                  }}
                >
                  TABLE
                </div>
                <b>{viewOrder?.table || "N/A"}</b>
              </div>

              {/* TOTAL */}
              <div>
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: "0.5rem",
                    color: "rgba(245,240,232,0.35)",
                    marginBottom: 4,
                  }}
                >
                  TOTAL
                </div>
                <b style={{ color: T.adminAmber }}>
                  ₹{Number(viewOrder?.total || 0).toLocaleString()}
                </b>
              </div>

              {/* STATUS */}
              <div>
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: "0.5rem",
                    color: "rgba(245,240,232,0.35)",
                    marginBottom: 4,
                  }}
                >
                  STATUS
                </div>
                <Badge type={BADGE_TYPE?.[viewOrder?.status]}>
                  {viewOrder?.status || "Unknown"}
                </Badge>
              </div>
            </div>

            {/* ITEMS */}
            <div style={{ fontSize: "0.82rem", marginBottom: 16 }}>
              <b>Items:</b>{" "}
              {typeof viewOrder.items === "string"
                ? viewOrder.items
                : Array.isArray(viewOrder.items) && viewOrder.items.length > 0
                  ? viewOrder.items
                    .map(
                      (i) =>
                        `${i?.title || "Item"} x${Number(i?.quantity || 1)}`
                    )
                    .join(", ")
                  : "No items"}
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setViewOrder(null)}>
                Close
              </Btn>

              <Btn
                variant="primary"
                onClick={() => {
                  showToast("Receipt printed!");
                  setViewOrder(null);
                }}
              >
                Print Receipt
              </Btn>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}