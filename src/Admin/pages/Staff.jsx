import { Panel, StatCard, StatsGrid, Badge, Tbl, Td, Btn } from '../components/AdminUI';
import { T } from '../globalstyle';

const STAFF_LIST = [
  { init:'J', name:'Jiyeon Park',   role:'MANAGER',      since:'Mar 2021', type:'Full Time',  status:'On Shift', color:T.adminAmber },
  { init:'M', name:'Minjun Kim',    role:'HEAD BARISTA',  since:'Jan 2022', type:'Full Time',  status:'On Shift', color:'#4caf7a' },
  { init:'S', name:'Soohyun Lee',   role:'BARISTA',       since:'Jun 2023', type:'Full Time',  status:'On Shift', color:'#6ab0e0' },
  { init:'H', name:'Hyeri Choi',    role:'BARISTA',       since:'Sep 2023', type:'Part Time',  status:'On Shift', color:'#e08a30' },
  { init:'D', name:'Dongwon Na',    role:'SERVER',        since:'Nov 2023', type:'Part Time',  status:'On Shift', color:'#a45ec9' },
  { init:'Y', name:'Yujin Oh',      role:'SERVER',        since:'Feb 2024', type:'Part Time',  status:'On Shift', color:'#c45e5e' },
  { init:'T', name:'Taeyeon Shin',  role:'BARISTA',       since:'Apr 2022', type:'Full Time',  status:'Day Off',  color:'rgba(245,240,232,0.25)' },
  { init:'G', name:'Gyuri Han',     role:'SERVER',        since:'Jul 2024', type:'Part Time',  status:'Day Off',  color:'rgba(245,240,232,0.25)' },
  { init:'B', name:'Byungchan Yoo', role:'KITCHEN',       since:'Jan 2023', type:'Full Time',  status:'Day Off',  color:'rgba(245,240,232,0.25)' },
];

const SCHEDULE = [
  { name:'Jiyeon P.',  days:['09–18','09–18','09–18','09–18','09–18','—','—'],    hours:'45h' },
  { name:'Minjun K.',  days:['08–16','08–16','—','08–16','08–16','10–20','10–20'], hours:'58h' },
  { name:'Soohyun L.', days:['—','10–18','10–18','10–18','10–18','11–21','—'],    hours:'40h' },
  { name:'Hyeri C.',   days:['12–20','—','12–20','12–20','—','12–22','12–22'],    hours:'48h' },
  { name:'Dongwon N.', days:['—','14–22','14–22','—','14–22','10–22','10–22'],    hours:'42h' },
];

export default function Staff() {
  return (
    <div className="fade-up">
      <StatsGrid cols={3}>
        <StatCard label="Total Staff" value={STAFF_LIST.length} />
        <StatCard label="On Shift"    value={STAFF_LIST.filter(s => s.status === 'On Shift').length} valueColor="#4caf7a" />
        <StatCard label="Day Off"     value={STAFF_LIST.filter(s => s.status === 'Day Off').length}  valueColor="rgba(245,240,232,0.4)" />
      </StatsGrid>

      {/* Staff Cards Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:22 }}>
        {STAFF_LIST.map((st, i) => (
          <div key={i} style={{
            background: 'rgba(196,137,42,0.06)',
            border: '1px solid rgba(196,137,42,0.12)',
            borderRadius: 8, padding: 16, display: 'flex', gap: 12,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%', background: st.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: T.display, fontSize: '1.2rem', color: T.adminBg, flexShrink: 0,
            }}>
              {st.init}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{st.name}</div>
              <div style={{ fontFamily: T.mono, fontSize: '0.53rem', color: T.adminAmber, marginTop: 3 }}>{st.role}</div>
              <div style={{ fontFamily: T.mono, fontSize: '0.56rem', color: 'rgba(245,240,232,0.38)', marginTop: 5 }}>
                Since {st.since} · {st.type}
              </div>
              <div style={{ marginTop: 8 }}>
                <Badge type={st.status === 'On Shift' ? 'ready' : 'wait'}>{st.status}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Schedule */}
      <Panel title="Weekly Schedule" action={<Btn>Feb 22–28, 2026</Btn>}>
        <Tbl headers={['Staff','Mon','Tue','Wed','Thu','Fri','Sat','Sun','Hours']}>
          {SCHEDULE.map((st, i) => (
            <tr key={i}>
              <Td bold>{st.name}</Td>
              {st.days.map((d, j) => (
                <Td key={j}>
                  {d === '—'
                    ? <span style={{ fontFamily: T.mono, fontSize: '0.62rem', color: 'rgba(245,240,232,0.2)' }}>—</span>
                    : <Badge type={j >= 5 ? 'prep' : 'ready'}>{d}</Badge>
                  }
                </Td>
              ))}
              <Td amber>{st.hours}</Td>
            </tr>
          ))}
        </Tbl>
      </Panel>
    </div>
  );
}