import { T } from '../globalstyle';

export function Panel({ title, action, children, noPad }) {
  return (
    <div style={{ background:T.adminSurface, border:`1px solid ${T.adminBorder}`, borderRadius:8, overflow:'hidden', marginBottom:22 }}>
      {title && (
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${T.adminBorder}`,
          display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
          <div style={{ fontFamily:T.display, fontSize:'1.1rem', letterSpacing:'0.05em', color:T.adminCream }}>{title}</div>
          {action && <div style={{ display:'flex', gap:8, alignItems:'center' }}>{action}</div>}
        </div>
      )}
      <div style={noPad ? {} : { padding:'18px 20px' }}>{children}</div>
    </div>
  );
}

export function StatCard({ label, value, change, changeType='neutral', valueColor }) {
  const colors = { up:'#4caf7a', down:'#e05555', neutral:'rgba(245,240,232,0.35)' };
  return (
    <div style={{ background:T.adminSurface, border:`1px solid ${T.adminBorder}`, borderRadius:8, padding:20 }}>
      <div style={{ fontFamily:T.mono, fontSize:'0.51rem', letterSpacing:'0.25em',
        color:'rgba(245,240,232,0.33)', textTransform:'uppercase', marginBottom:10 }}>{label}</div>
      <div style={{ fontFamily:T.display, fontSize:'2.4rem', color: valueColor || T.adminAmber, lineHeight:1 }}>{value}</div>
      {change && <div style={{ fontFamily:T.mono, fontSize:'0.57rem', marginTop:6, color:colors[changeType] }}>{change}</div>}
    </div>
  );
}

export function StatsGrid({ children, cols=4 }) {
  return <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gap:16, marginBottom:22 }}>{children}</div>;
}

export function Btn({ children, variant='ghost', size='md', onClick, style:ex, disabled }) {
  const base = { fontFamily:T.mono, fontSize:size==='sm'?'0.53rem':'0.63rem', letterSpacing:'0.08em',
    padding:size==='sm'?'4px 10px':'7px 16px', borderRadius:4, cursor:disabled?'not-allowed':'pointer',
    border:'none', transition:'all 0.2s', opacity:disabled?0.5:1, ...ex };
  const variants = {
    primary: { background:T.adminAmber, color:T.adminBg, fontWeight:700 },
    ghost:   { background:'transparent', color:T.adminCream, border:`1px solid rgba(245,240,232,0.2)` },
    danger:  { background:'rgba(139,32,32,0.3)', color:'#e05555', border:'1px solid rgba(224,85,85,0.3)' },
    success: { background:'rgba(42,92,63,0.3)',  color:'#4caf7a', border:'1px solid rgba(76,175,122,0.3)' },
  };
  return <button style={{ ...base, ...variants[variant] }} onClick={onClick} disabled={disabled}>{children}</button>;
}

export function Badge({ children, type='wait' }) {
  const types = {
    ready: { bg:'rgba(42,92,63,0.3)',      color:'#4caf7a', border:'1px solid rgba(76,175,122,0.3)' },
    prep:  { bg:'rgba(196,137,42,0.15)',   color:T.adminAmber, border:`1px solid rgba(196,137,42,0.3)` },
    wait:  { bg:'rgba(245,240,232,0.05)', color:'rgba(245,240,232,0.4)', border:'1px solid rgba(245,240,232,0.1)' },
    done:  { bg:'rgba(26,58,92,0.3)',      color:'#6ab0e0', border:'1px solid rgba(106,176,224,0.3)' },
    low:   { bg:'rgba(139,32,32,0.3)',     color:'#e05555', border:'1px solid rgba(224,85,85,0.3)' },
  };
  const t = types[type] || types.wait;
  return (
    <span style={{ fontFamily:T.mono, fontSize:'0.5rem', letterSpacing:'0.1em', padding:'3px 9px',
      borderRadius:20, textTransform:'uppercase', whiteSpace:'nowrap',
      background:t.bg, color:t.color, border:t.border }}>
      {children}
    </span>
  );
}

export function Toggle({ on=true, onChange }) {
  return (
    <div onClick={() => onChange && onChange(!on)} style={{ width:36, height:20, flexShrink:0, cursor:'pointer',
      background: on ? T.green : 'rgba(245,240,232,0.15)', borderRadius:10, position:'relative', transition:'background 0.2s' }}>
      <div style={{ position:'absolute', width:14, height:14, background:'white', borderRadius:'50%',
        top:3, left:on?'auto':3, right:on?3:'auto', transition:'all 0.2s' }} />
    </div>
  );
}

export function Tbl({ headers, children }) {
  return (
    <table style={{ width:'100%', borderCollapse:'collapse' }}>
      <thead>
        <tr>{headers.map((h,i) => (
          <th key={i} style={{ fontFamily:T.mono, fontSize:'0.49rem', letterSpacing:'0.2em', color:'rgba(245,240,232,0.28)',
            textTransform:'uppercase', padding:'8px 10px', textAlign:'left', borderBottom:`1px solid rgba(196,137,42,0.2)` }}>{h}</th>
        ))}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

export function Td({ children, mono, amber, bold }) {
  return (
    <td style={{ padding:'10px 10px', borderBottom:'1px solid rgba(245,240,232,0.05)',
      fontFamily: (mono||amber) ? T.mono : T.serif,
      fontSize: (mono||amber) ? '0.67rem' : '0.82rem',
      color: amber ? T.adminAmber : mono ? 'rgba(245,240,232,0.5)' : T.adminCream,
      fontWeight: bold ? 700 : 'normal' }}>
      {children}
    </td>
  );
}

export function ProgressBar({ value, color }) {
  return (
    <div style={{ height:6, background:'rgba(245,240,232,0.1)', borderRadius:3, overflow:'hidden', marginTop:5 }}>
      <div style={{ height:'100%', width:`${Math.max(0,Math.min(100,value))}%`,
        background: color || T.adminAmber, borderRadius:3, transition:'width 0.5s ease' }} />
    </div>
  );
}

export function BarChart({ data }) {
  const max = Math.max(...data.map(d=>d.val), 1);
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:110 }}>
      {data.map((d,i) => (
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
          <div style={{ fontFamily:T.mono, fontSize:'0.51rem', color:T.adminAmber }}>{d.label2}</div>
          <div style={{ width:'100%', minHeight:4,
            height:`${Math.round((d.val/max)*100)}px`,
            background: d.highlight
              ? 'linear-gradient(to top,#f4a83a,rgba(244,168,58,0.4))'
              : `linear-gradient(to top,${T.adminAmber},rgba(196,137,42,0.3))`,
            borderRadius:'4px 4px 0 0' }} />
          <div style={{ fontFamily:T.mono, fontSize:'0.49rem', color:'rgba(245,240,232,0.33)' }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}