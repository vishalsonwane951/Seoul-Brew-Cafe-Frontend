import { useApp } from '../context/AppContext';
import { Panel, StatCard, StatsGrid, Badge, Tbl, Td, BarChart, ProgressBar } from '../components/AdminUI';

const weekData = [
  {label:'MON',label2:'₹320K',val:320},{label:'TUE',label2:'₹410K',val:410},
  {label:'WED',label2:'₹390K',val:390},{label:'THU',label2:'₹460K',val:460},
  {label:'FRI',label2:'₹550K',val:550},{label:'SAT',label2:'₹620K',val:620,highlight:true},
  {label:'SUN',label2:'₹482K',val:482},
];

const topItems = [
  {name:'Dalgona Latte',sold:142,pct:90},{name:'Jeju Matcha',sold:118,pct:75},
  {name:'Seoul Cold Brew',sold:97,pct:62},{name:'Red Bean Waffle',sold:85,pct:54},
  {name:'Honey Toast',sold:73,pct:46},
];

export default function Overview() {
  const { orders } = useApp();
  return (
    <div className="fade-up">
      <StatsGrid>
        <StatCard label="Today's Revenue" value="₹482K" change="↑ 14% vs yesterday" changeType="up" />
        <StatCard label="Orders Today"    value="87"    change="↑ 9 more than avg"  changeType="up" />
        <StatCard label="Avg Order Value" value="₹5.5K" change="↓ 3% vs last week"  changeType="down" />
        <StatCard label="Tables Occupied" value="6/10"  change="60% capacity"        changeType="neutral" />
      </StatsGrid>

      <Panel title="Weekly Revenue">
        <BarChart data={weekData} />
      </Panel>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:20}}>
        <Panel title="Live Orders">
  <Tbl headers={['#','Customer','Items','Status']}>
    {(orders || []).slice(0, 5).map((o) => (
      <tr key={o.id} style={{ cursor: 'default' }}>
        <Td amber>#{o.id}</Td>
        <Td bold>{o.customer}</Td>
        <Td mono>{o.items}</Td>
        <Td>
          <Badge
            type={
              o.status === 'Ready'
                ? 'ready'
                : o.status === 'Preparing'
                ? 'prep'
                : o.status === 'Done'
                ? 'done'
                : 'wait'
            }
          >
            {o.status}
          </Badge>
        </Td>
      </tr>
    ))}
  </Tbl>
</Panel>

        <Panel title="Top Selling Items">
          {topItems.map((item,i)=>(
            <div key={i} style={{marginBottom:14}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.82rem',marginBottom:3}}>
                <span>{item.name}</span>
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:'0.63rem',color:'#c4892a'}}>{item.sold} sold</span>
              </div>
              <ProgressBar value={item.pct} />
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}