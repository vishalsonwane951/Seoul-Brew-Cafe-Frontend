import { useApp } from '../context/AppContext';
import { Panel, StatCard, StatsGrid, Badge, Tbl, Td, BarChart, ProgressBar } from '../components/AdminUI';

const weekData = [
  {label:'MON',label2:'₹ 0',val:1145},{label:'TUE',label2:'₹ 0',val:1860},
  {label:'WED',label2:'₹ 0',val:1540},{label:'THU',label2:'₹ 0',val:2457},
  {label:'FRI',label2:'₹ 0',val:1245},{label:'SAT',label2:'₹ 0',val:3457,highlight:true},
  {label:'SUN',label2:'₹ 0',val:864},
];

const topItems = [
  {name:'Dalgona Latte',sold:0,pct:0},{name:'Jeju Matcha',sold:0,pct:0},
  {name:'Seoul Cold Brew',sold:0,pct:0},{name:'Red Bean Waffle',sold:0,pct:0},
  {name:'Honey Toast',sold:0,pct:0},
];

export default function Overview() {
  const { orders } = useApp();
  const safeOrders = Array.isArray(orders) ? orders : [];
  return (
    <div className="fade-up">
      <StatsGrid>
        <StatCard label="Today's Revenue" value="₹ 7256" change="↑ 14% vs yesterday" changeType="up" />
        <StatCard label="Orders Today"    value="  72"    change="↑ 9 more than avg"  changeType="up" />
        <StatCard label="Avg Order Value" value="₹  243" change="↓ 3% vs last week"  changeType="down" />
        <StatCard label="Tables Occupied" value="08/10"  change="60% capacity"        changeType="neutral" />
      </StatsGrid>

      <Panel title="Weekly Revenue">
        <BarChart data={weekData} />
      </Panel>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:20}}>
        <Panel title="Live Orders">
  <Tbl headers={['#','Customer','Items','Status']}>
    {safeOrders.slice(0, 5).map((o) => (
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