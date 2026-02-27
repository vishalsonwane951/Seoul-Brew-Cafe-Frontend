import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Toast } from '../components/SharedUI';
import { T, GLOBAL_CSS } from '../globalstyle';
import { useContext } from 'react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  {
    group: 'Dashboard', items: [
      { to: '/admin', label: 'Overview', icon: '⊞', end: true },
      { to: '/admin/orders', label: 'Orders', icon: '📋', badge: 'orders' },
      { to: '/admin/menu', label: 'Menu', icon: '☕' },
      { to: '/admin/reservations', label: 'Reservations', icon: '📅', badge: 'reservations' },
    ]
  },
  {
    group: 'Manage', items: [
      { to: '/admin/staff', label: 'Staff', icon: '👥' },
      { to: '/admin/inventory', label: 'Inventory', icon: '📦' },
      { to: '/admin/analytics', label: 'Analytics', icon: '📊' },
      { to: '/admin/reviews', label: 'Reviews', icon: '💬', badge: 'reviews' },
    ]
  },
  {
    group: 'System', items: [
      { to: '/admin/settings', label: 'Settings', icon: '⚙' },
    ]
  },
];

const PAGE_CFG = {
  '/admin': { title: 'Good Morning, Jiyeon ☀' },
  '/admin/orders': { title: 'Orders' },
  '/admin/menu': { title: 'Menu Management' },
  '/admin/reservations': { title: 'Reservations' },
  '/admin/staff': { title: 'Staff' },
  '/admin/inventory': { title: 'Inventory' },
  '/admin/analytics': { title: 'Analytics' },
  '/admin/reviews': { title: 'Reviews' },
  '/admin/settings': { title: 'Settings' },
};

export default function AdminLayout() {
  const { user } = useAuth()
  const { orders, reservations, toast } = useApp();
  const location = useLocation();
  const cfg = PAGE_CFG[location.pathname] || PAGE_CFG['/admin'];

  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeReservations = Array.isArray(reservations)
    ? reservations
    : [];
    console.log(`user: ${user}`)

  // ✅ BADGES (Now cannot crash)
  const badges = {
    orders: (safeOrders || []).filter(
      (o) => o?.status === "Waiting" || o?.status === "Preparing"
    ).length,

    reservations: (safeReservations || []).filter(
      (r) => r?.status === "Pending"
    ).length,

    reviews: 3,
  };

  return (
    <>
      <style>{GLOBAL_CSS}
        {` .admin-nav-item { display:flex; align-items:center; gap:10px; padding:10px 24px; cursor:pointer;
          font-size:0.82rem; color:rgba(245,240,232,0.52); border-left:3px solid transparent; transition:all 0.18s; text-decoration:none; }
        .admin-nav-item:hover { color:#f5f0e8; background:rgba(196,137,42,0.07); border-left-color:rgba(196,137,42,0.5); }
        .admin-nav-item.active { color:#f5f0e8; background:rgba(196,137,42,0.1); border-left-color:#c4892a; }
        .portal-switch { display:flex; gap:8px; padding:12px 20px; border-top:1px solid rgba(196,137,42,0.2); }
        .portal-btn { flex:1; padding:8px; border-radius:6px; border:none; cursor:pointer; font-family:${T.mono}; font-size:0.58rem; letter-spacing:0.1em; text-align:center; text-decoration:none; transition:all 0.2s; }
      
    `} </style>
      <div style={{ display: 'flex', minHeight: '100vh', background: T.adminBg, color: T.adminCream }}>

        {/* SIDEBAR */}
        <aside style={{
          width: 240, minHeight: '100vh', background: T.adminSurface,
          borderRight: `1px solid ${T.adminBorder}`, display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100
        }}>

          <div style={{ padding: '24px 24px 18px', borderBottom: `1px solid ${T.adminBorder}` }}>
            <div style={{ fontFamily: T.display, fontSize: '2rem', letterSpacing: '0.05em', color: T.adminAmber, lineHeight: 1 }}>Seoul Brew</div>
            <div style={{ fontFamily: T.mono, fontSize: '0.5rem', letterSpacing: '0.3em', color: 'rgba(245,240,232,0.28)', marginTop: 3 }}>☕ ADMIN PORTAL</div>
          </div>

          <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
            {NAV.map(group => (
              <div key={group.group}>
                <div style={{
                  fontFamily: T.mono, fontSize: '0.46rem', letterSpacing: '0.3em',
                  color: 'rgba(245,240,232,0.2)', padding: '12px 24px 4px', textTransform: 'uppercase'
                }}>{group.group}</div>
                {group.items.map(item => (
                  <NavLink key={item.to} to={item.to} end={item.end}
                    className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}>
                    <span style={{ fontSize: '0.88rem', width: 18, textAlign: 'center' }}>{item.icon}</span>
                    {item.label}
                    {item.badge && badges[item.badge] > 0 && (
                      <span style={{
                        marginLeft: 'auto', background: T.adminAmber, color: T.adminBg,
                        fontFamily: T.mono, fontSize: '0.5rem', fontWeight: 700, padding: '2px 6px', borderRadius: 10
                      }}>
                        {badges[item.badge]}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>

          {/* Portal Switch */}
          <div className="portal-switch">
            <a href="/admin" className="portal-btn" style={{ background: T.adminAmber, color: T.adminBg, fontWeight: 700 }}>ADMIN</a>
            <a href="/" className="portal-btn" style={{ background: 'rgba(245,240,232,0.08)', color: T.adminCream, border: `1px solid rgba(245,240,232,0.15)` }}>CUSTOMER ↗</a>
          </div>

         <div style={{ padding: '14px 22px', borderTop: `1px solid ${T.adminBorder}` }}>
  {user?.name && (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: T.adminAmber,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: T.display,
        fontSize: '1rem',
        color: T.adminBg,
        flexShrink: 0
      }}>
        {user.name.charAt(0)}
      </div>

      <div>
        <div style={{ fontSize: '0.8rem' }}>{user.name || '?'}</div>
        <div style={{
          fontFamily: T.mono,
          fontSize: '0.48rem',
          color: T.adminAmber
        }}>
          ADMIN
        </div>
      </div>
    </div>
  )}
</div>
        </aside>

        {/* MAIN CONTENT */}
        <div style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <header style={{
            padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: `1px solid ${T.adminBorder}`, background: 'rgba(26,15,10,0.92)', backdropFilter: 'blur(10px)',
            position: 'sticky', top: 0, zIndex: 50
          }}>
            <div style={{ fontFamily: T.display, fontSize: '1.55rem', letterSpacing: '0.05em' }}>{cfg.title}</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.adminAmber }} className="pulse-dot" />
              <span style={{ fontFamily: T.mono, fontSize: '0.58rem', color: 'rgba(245,240,232,0.35)' }}>
                {new Date().toLocaleDateString('en-KR', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </header>
          <main style={{ padding: '28px 32px', flex: 1 }}>
            <Outlet />
          </main>
        </div>

        <Toast message={toast} />
      </div>
    </>
  );
}