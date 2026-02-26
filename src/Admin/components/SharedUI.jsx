import { T } from '../globalstyle';

// ── Toast ──────────────────────────────────────────────────
export function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{ position:'fixed', bottom:28, right:28, background:T.adminAmber, color:T.adminBg,
      fontFamily:T.mono, fontSize:'0.68rem', fontWeight:700, padding:'11px 20px', borderRadius:6,
      zIndex:9999, letterSpacing:'0.05em', boxShadow:'0 4px 20px rgba(196,137,42,0.4)',
      animation:'fadeUp 0.3s ease' }}>
      {message}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────
export function Modal({ title, open, onClose, children, wide }) {
  if (!open) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position:'fixed', inset:0, background:'rgba(26,15,10,0.88)', backdropFilter:'blur(5px)',
      zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:T.adminSurface, border:`1px solid rgba(196,137,42,0.3)`, borderRadius:10,
        width: wide ? 680 : 520, maxWidth:'95vw', maxHeight:'90vh', overflowY:'auto',
        padding:28, animation:'fadeUp 0.3s ease' }}>
        <div style={{ fontFamily:T.display, fontSize:'1.5rem', letterSpacing:'0.05em',
          color:T.adminAmber, marginBottom:22 }}>{title}</div>
        {children}
      </div>
    </div>
  );
}

// ── Shared form styles ─────────────────────────────────────
export const inputStyle = (surface = T.adminSurface) => ({
  width:'100%', background:'rgba(245,240,232,0.06)', border:`1px solid rgba(196,137,42,0.22)`,
  borderRadius:4, padding:'8px 12px', color:T.adminCream, fontSize:'0.84rem', outline:'none',
});

export const selectStyle = () => ({
  width:'100%', background:T.adminSurface, border:`1px solid rgba(196,137,42,0.22)`,
  borderRadius:4, padding:'8px 12px', color:T.adminCream, fontSize:'0.84rem', outline:'none',
});

export const textareaStyle = () => ({
  ...inputStyle(), resize:'vertical', minHeight:80,
});

export function FormGroup({ label, children }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontFamily:T.mono, fontSize:'0.5rem', letterSpacing:'0.25em',
        color:'rgba(245,240,232,0.38)', textTransform:'uppercase', marginBottom:7, display:'block' }}>
        {label}
      </label>
      {children}
    </div>
  );
}