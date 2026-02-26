import { Panel, StatCard, StatsGrid, ProgressBar, BarChart } from '../components/AdminUI';
import { T } from '../globalstyle';

const CATEGORY_DATA = [
  { name:'☕ Coffee',      pct:42, val:'₹5.96M', color: T.adminAmber },
  { name:'🍵 Tea & Latte', pct:28, val:'₹3.98M', color:'#4caf7a'    },
  { name:'🧇 Food',        pct:20, val:'₹2.84M', color:'#6ab0e0'    },
  { name:'🥐 Bakery',      pct:10, val:'₹1.42M', color:'#a45ec9'    },
];

const HOURLY_DATA = [3,9,18,24,31,28,22,15,19,26,21,8].map((val, i) => ({
  label:  ['8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm'][i],
  label2: String(val),
  val,
}));

const MONTHLY_DATA = [
  { label:'Jan', label2:'₹11.2M', val:112 },
  { label:'Feb', label2:'₹14.2M', val:142, highlight:true },
  { label:'Mar', label2:'—', val:0 },
  { label:'Apr', label2:'—', val:0 },
  { label:'May', label2:'—', val:0 },
  { label:'Jun', label2:'—', val:0 },
];

const PAYMENT_DATA = [
  { name:'💳 Card',      pct:58, color: T.adminAmber },
  { name:'📱 KakaoPay',  pct:25, color:'#4caf7a'    },
  { name:'💵 Cash',      pct:12, color:'#6ab0e0'    },
  { name:'📦 Other',     pct: 5, color:'#a45ec9'    },
];

export default function Analytics() {
  return (
    <div className="fade-up">
      <StatsGrid>
        <StatCard label="Monthly Revenue" value="₹14.2M" change="↑ 18% vs last month" changeType="up" />
        <StatCard label="Total Orders"    value="2,847"  change="↑ 312 more"           changeType="up" />
        <StatCard label="Avg Daily Rev"   value="₹459K"  change="↑ 7%"                changeType="up" />
        <StatCard label="Customer Rating" value="4.8 ★"  change="↑ 0.2 pts"           changeType="up" />
      </StatsGrid>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:20 }}>
        {/* Revenue by Category */}
        <Panel title="Revenue by Category">
          {CATEGORY_DATA.map((c, i) => (
            <div key={i} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', marginBottom:3 }}>
                <span>{c.name}</span>
                <span style={{ fontFamily: T.mono, fontSize:'0.63rem', color: c.color }}>
                  {c.pct}% · {c.val}
                </span>
              </div>
              <ProgressBar value={c.pct} color={c.color} />
            </div>
          ))}
        </Panel>

        {/* Hourly Traffic */}
        <Panel title="Hourly Traffic (Today)">
          <BarChart data={HOURLY_DATA} />
        </Panel>
      </div>

      {/* Monthly Trend */}
      <Panel title="Monthly Revenue Trend (2026)">
        <BarChart data={MONTHLY_DATA} />
      </Panel>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* Customer Retention */}
        <Panel title="Customer Retention">
          <div style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', marginBottom:3 }}>
              <span>New Customers</span>
              <span style={{ fontFamily: T.mono, fontSize:'0.63rem', color:'#6ab0e0' }}>35% · 998</span>
            </div>
            <ProgressBar value={35} color="#6ab0e0" />
          </div>
          <div style={{ marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', marginBottom:3 }}>
              <span>Returning Customers</span>
              <span style={{ fontFamily: T.mono, fontSize:'0.63rem', color:'#4caf7a' }}>65% · 1,849</span>
            </div>
            <ProgressBar value={65} color="#4caf7a" />
          </div>
          <div style={{
            background: 'rgba(196,137,42,0.06)',
            border: `1px solid rgba(196,137,42,0.15)`,
            borderRadius: 6, padding: 14,
          }}>
            <div style={{ fontFamily: T.mono, fontSize:'0.5rem', color:'rgba(245,240,232,0.35)', letterSpacing:'0.2em', marginBottom:6 }}>
              LOYALTY PROGRAM
            </div>
            <div style={{ fontSize:'0.84rem' }}>1,240 active members</div>
            <div style={{ fontFamily: T.mono, fontSize:'0.6rem', color: T.adminAmber, marginTop:4 }}>87 new this month ↑</div>
          </div>
        </Panel>

        {/* Payment Methods */}
        <Panel title="Payment Methods">
          {PAYMENT_DATA.map((p, i) => (
            <div key={i} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', marginBottom:3 }}>
                <span>{p.name}</span>
                <span style={{ fontFamily: T.mono, fontSize:'0.63rem', color: p.color }}>{p.pct}%</span>
              </div>
              <ProgressBar value={p.pct} color={p.color} />
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}