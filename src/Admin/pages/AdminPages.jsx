// // ── Staff ───────────────────────────────────────────────────
// import { useState } from 'react';
// import { useApp } from '../../shared/context/AppContext';
// import { Panel, StatCard, StatsGrid, Badge, Tbl, Td, Btn, ProgressBar, BarChart, Toggle } from '../components/AdminUI';
// import { Modal, FormGroup, inputStyle, selectStyle, textareaStyle } from '../../shared/components/SharedUI';
// import { T } from '../../shared/tokens';

// const STAFF_LIST = [
//   {init:'J',name:'Jiyeon Park',   role:'MANAGER',      since:'Mar 2021',type:'Full Time', status:'On Shift',color:T.adminAmber},
//   {init:'M',name:'Minjun Kim',    role:'HEAD BARISTA',  since:'Jan 2022',type:'Full Time', status:'On Shift',color:'#4caf7a'},
//   {init:'S',name:'Soohyun Lee',   role:'BARISTA',       since:'Jun 2023',type:'Full Time', status:'On Shift',color:'#6ab0e0'},
//   {init:'H',name:'Hyeri Choi',    role:'BARISTA',       since:'Sep 2023',type:'Part Time', status:'On Shift',color:'#e08a30'},
//   {init:'D',name:'Dongwon Na',    role:'SERVER',        since:'Nov 2023',type:'Part Time', status:'On Shift',color:'#a45ec9'},
//   {init:'Y',name:'Yujin Oh',      role:'SERVER',        since:'Feb 2024',type:'Part Time', status:'On Shift',color:'#c45e5e'},
//   {init:'T',name:'Taeyeon Shin',  role:'BARISTA',       since:'Apr 2022',type:'Full Time', status:'Day Off', color:'rgba(245,240,232,0.25)'},
//   {init:'G',name:'Gyuri Han',     role:'SERVER',        since:'Jul 2024',type:'Part Time', status:'Day Off', color:'rgba(245,240,232,0.25)'},
//   {init:'B',name:'Byungchan Yoo', role:'KITCHEN',       since:'Jan 2023',type:'Full Time', status:'Day Off', color:'rgba(245,240,232,0.25)'},
// ];

// const SCHEDULE = [
//   {name:'Jiyeon P.',  days:['09–18','09–18','09–18','09–18','09–18','—','—'],   hours:'45h'},
//   {name:'Minjun K.',  days:['08–16','08–16','—','08–16','08–16','10–20','10–20'], hours:'58h'},
//   {name:'Soohyun L.', days:['—','10–18','10–18','10–18','10–18','11–21','—'],   hours:'40h'},
//   {name:'Hyeri C.',   days:['12–20','—','12–20','12–20','—','12–22','12–22'],   hours:'48h'},
//   {name:'Dongwon N.', days:['—','14–22','14–22','—','14–22','10–22','10–22'],   hours:'42h'},
// ];

// export function Staff() {
//   return (
//     <div className="fade-up">
//       <StatsGrid cols={3}>
//         <StatCard label="Total Staff" value={STAFF_LIST.length} />
//         <StatCard label="On Shift"    value={STAFF_LIST.filter(s=>s.status==='On Shift').length} valueColor="#4caf7a" />
//         <StatCard label="Day Off"     value={STAFF_LIST.filter(s=>s.status==='Day Off').length} valueColor="rgba(245,240,232,0.4)" />
//       </StatsGrid>

//       <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:22}}>
//         {STAFF_LIST.map((st,i)=>(
//           <div key={i} style={{background:'rgba(196,137,42,0.06)',border:`1px solid rgba(196,137,42,0.12)`,borderRadius:8,padding:16,display:'flex',gap:12}}>
//             <div style={{width:42,height:42,borderRadius:'50%',background:st.color,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:T.display,fontSize:'1.2rem',color:T.adminBg,flexShrink:0}}>{st.init}</div>
//             <div>
//               <div style={{fontWeight:700,fontSize:'0.88rem'}}>{st.name}</div>
//               <div style={{fontFamily:T.mono,fontSize:'0.53rem',color:T.adminAmber,marginTop:3}}>{st.role}</div>
//               <div style={{fontFamily:T.mono,fontSize:'0.56rem',color:'rgba(245,240,232,0.38)',marginTop:5}}>Since {st.since} · {st.type}</div>
//               <div style={{marginTop:8}}><Badge type={st.status==='On Shift'?'ready':'wait'}>{st.status}</Badge></div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <Panel title="Weekly Schedule" action={<Btn>Feb 22–28, 2026</Btn>}>
//         <Tbl headers={['Staff','Mon','Tue','Wed','Thu','Fri','Sat','Sun','Hours']}>
//           {SCHEDULE.map((st,i)=>(
//             <tr key={i}>
//               <Td bold>{st.name}</Td>
//               {st.days.map((d,j)=>(
//                 <Td key={j}>
//                   {d==='—'
//                     ? <span style={{fontFamily:T.mono,fontSize:'0.62rem',color:'rgba(245,240,232,0.2)'}}>—</span>
//                     : <Badge type={j>=5?'prep':'ready'}>{d}</Badge>}
//                 </Td>
//               ))}
//               <Td amber>{st.hours}</Td>
//             </tr>
//           ))}
//         </Tbl>
//       </Panel>
//     </div>
//   );
// }

// // ── Inventory ──────────────────────────────────────────────
// const INV = [
//   {icon:'☕',name:'Espresso Beans',    detail:'8.2kg / Min 5kg',  pct:80, s:'good'},
//   {icon:'🍵',name:'Jeju Matcha Powder',detail:'1.1kg / Min 1kg',  pct:22, s:'low'},
//   {icon:'🥛',name:'Whole Milk',         detail:'24L / Min 10L',   pct:70, s:'good'},
//   {icon:'🥛',name:'Oat Milk',           detail:'6L / Min 5L',     pct:30, s:'warn'},
//   {icon:'🍮',name:'Dalgona Mix',         detail:'2.3kg / Min 1kg', pct:60, s:'good'},
//   {icon:'🧇',name:'Waffle Mix',          detail:'3.5kg / Min 2kg', pct:75, s:'good'},
//   {icon:'🥚',name:'Eggs (free-range)',   detail:'24pcs / Min 30',  pct:15, s:'low'},
//   {icon:'🍓',name:'Strawberry Puree',   detail:'0.8L / Min 1L',   pct:0,  s:'out'},
//   {icon:'🍞',name:'Bread Loaves',        detail:'8pcs / Min 5',    pct:60, s:'good'},
//   {icon:'🧈',name:'Butter (Korean)',     detail:'1.2kg / Min 0.5kg',pct:85,s:'good'},
// ];
// const INV_COLOR = {good:'#4caf7a',warn:T.adminAmber,low:'#e05555',out:'#e05555'};
// const INV_LABEL = {good:'Good',warn:'Order Soon',low:'Low!',out:'Out!'};
// const SUP_ORDERS = [
//   {date:'Feb 20',supplier:'Seoul Roasters Co.',   items:'Espresso Beans 10kg',          total:'₹85,000',status:'Delivered'},
//   {date:'Feb 19',supplier:'Jeju Green Tea Farm',  items:'Matcha 2kg',                   total:'₹60,000',status:'In Transit'},
//   {date:'Feb 18',supplier:'Maeil Dairy',           items:'Whole Milk 50L, Oat Milk 20L', total:'₹45,000',status:'Delivered'},
// ];

// export function Inventory() {
//   const { showToast } = useApp();
//   const [orderOpen, setOrderOpen] = useState(false);

//   const InvRow = ({item,last}) => (
//     <div style={{display:'flex',alignItems:'center',gap:12,padding:'11px 0',borderBottom:last?'none':'1px solid rgba(245,240,232,0.06)'}}>
//       <div style={{width:34,height:34,borderRadius:6,background:'rgba(196,137,42,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>{item.icon}</div>
//       <div style={{flex:1}}>
//         <div style={{fontSize:'0.82rem',fontWeight:700}}>{item.name}</div>
//         <div style={{fontFamily:T.mono,fontSize:'0.57rem',color:'rgba(245,240,232,0.38)',marginTop:2}}>{item.detail}</div>
//       </div>
//       <div style={{width:80}}>
//         <ProgressBar value={item.pct} color={INV_COLOR[item.s]} />
//         <div style={{fontFamily:T.mono,fontSize:'0.5rem',color:INV_COLOR[item.s],marginTop:4}}>{INV_LABEL[item.s]}</div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="fade-up">
//       <StatsGrid>
//         <StatCard label="Total Items"    value={INV.length} />
//         <StatCard label="Low Stock"      value={INV.filter(i=>i.s==='low').length}  valueColor="#e05555" />
//         <StatCard label="Out of Stock"   value={INV.filter(i=>i.s==='out').length}  valueColor="#8b2020" />
//         <StatCard label="Reorder Needed" value={INV.filter(i=>i.s!=='good').length} valueColor={T.adminAmber} />
//       </StatsGrid>
//       <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
//         <Panel title="Coffee & Ingredients" action={<Btn variant="primary" size="sm" onClick={()=>showToast('Orders placed!')}>Order All Low</Btn>}>
//           {INV.slice(0,5).map((item,i)=><InvRow key={i} item={item} last={i===4} />)}
//         </Panel>
//         <Panel title="Food & Bakery">
//           {INV.slice(5).map((item,i)=><InvRow key={i} item={item} last={i===4} />)}
//         </Panel>
//       </div>
//       <Panel title="Supplier Order History" action={<Btn variant="primary" onClick={()=>setOrderOpen(true)}>+ New Order</Btn>}>
//         <Tbl headers={['Date','Supplier','Items','Total','Status']}>
//           {SUP_ORDERS.map((o,i)=>(
//             <tr key={i}>
//               <Td mono>{o.date}</Td><Td bold>{o.supplier}</Td><Td mono>{o.items}</Td>
//               <Td amber>{o.total}</Td><Td><Badge type={o.status==='Delivered'?'ready':'prep'}>{o.status}</Badge></Td>
//             </tr>
//           ))}
//         </Tbl>
//       </Panel>
//       <Modal title="New Supplier Order" open={orderOpen} onClose={()=>setOrderOpen(false)}>
//         <FormGroup label="Supplier"><select style={selectStyle()}><option>Seoul Roasters Co.</option><option>Jeju Green Tea Farm</option><option>Maeil Dairy</option><option>Other</option></select></FormGroup>
//         <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
//           <FormGroup label="Item"><input style={inputStyle()} placeholder="e.g. Espresso Beans" /></FormGroup>
//           <FormGroup label="Quantity"><input style={inputStyle()} placeholder="e.g. 10kg" /></FormGroup>
//           <FormGroup label="Est. Cost (₹)"><input style={inputStyle()} placeholder="85000" /></FormGroup>
//           <FormGroup label="Delivery Date"><input type="date" style={inputStyle()} /></FormGroup>
//         </div>
//         <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:16}}>
//           <Btn variant="ghost" onClick={()=>setOrderOpen(false)}>Cancel</Btn>
//           <Btn variant="primary" onClick={()=>{showToast('Order submitted!');setOrderOpen(false);}}>Place Order</Btn>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// // ── Analytics ──────────────────────────────────────────────
// const CAT_DATA = [
//   {name:'☕ Coffee',   pct:42,val:'₹5.96M',color:T.adminAmber},
//   {name:'🍵 Tea & Latte',pct:28,val:'₹3.98M',color:'#4caf7a'},
//   {name:'🧇 Food',    pct:20,val:'₹2.84M',color:'#6ab0e0'},
//   {name:'🥐 Bakery',  pct:10,val:'₹1.42M',color:'#a45ec9'},
// ];
// const HOURLY = [3,9,18,24,31,28,22,15,19,26,21,8].map((v,i)=>({label:['8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm'][i],label2:String(v),val:v}));
// const MONTHLY = [{label:'Jan',label2:'₹11.2M',val:112},{label:'Feb',label2:'₹14.2M',val:142,highlight:true},{label:'Mar',label2:'—',val:0},{label:'Apr',label2:'—',val:0},{label:'May',label2:'—',val:0},{label:'Jun',label2:'—',val:0}];
// const PAYMENTS = [{name:'💳 Card',pct:58,color:T.adminAmber},{name:'📱 KakaoPay',pct:25,color:'#4caf7a'},{name:'💵 Cash',pct:12,color:'#6ab0e0'},{name:'📦 Other',pct:5,color:'#a45ec9'}];

// export function Analytics() {
//   return (
//     <div className="fade-up">
//       <StatsGrid>
//         <StatCard label="Monthly Revenue" value="₹14.2M" change="↑ 18% vs last month" changeType="up" />
//         <StatCard label="Total Orders"    value="2,847"  change="↑ 312 more" changeType="up" />
//         <StatCard label="Avg Daily Rev"   value="₹459K"  change="↑ 7%" changeType="up" />
//         <StatCard label="Customer Rating" value="4.8 ★"  change="↑ 0.2 pts" changeType="up" />
//       </StatsGrid>
//       <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:20}}>
//         <Panel title="Revenue by Category">
//           {CAT_DATA.map((c,i)=>(
//             <div key={i} style={{marginBottom:14}}>
//               <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.82rem',marginBottom:3}}>
//                 <span>{c.name}</span><span style={{fontFamily:T.mono,fontSize:'0.63rem',color:c.color}}>{c.pct}% · {c.val}</span>
//               </div>
//               <ProgressBar value={c.pct} color={c.color} />
//             </div>
//           ))}
//         </Panel>
//         <Panel title="Hourly Traffic (Today)"><BarChart data={HOURLY} /></Panel>
//       </div>
//       <Panel title="Monthly Revenue Trend (2026)"><BarChart data={MONTHLY} /></Panel>
//       <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
//         <Panel title="Customer Retention">
//           <div style={{marginBottom:14}}>
//             <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.82rem',marginBottom:3}}><span>New Customers</span><span style={{fontFamily:T.mono,fontSize:'0.63rem',color:'#6ab0e0'}}>35% · 998</span></div>
//             <ProgressBar value={35} color="#6ab0e0" />
//           </div>
//           <div style={{marginBottom:20}}>
//             <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.82rem',marginBottom:3}}><span>Returning</span><span style={{fontFamily:T.mono,fontSize:'0.63rem',color:'#4caf7a'}}>65% · 1,849</span></div>
//             <ProgressBar value={65} color="#4caf7a" />
//           </div>
//           <div style={{background:'rgba(196,137,42,0.06)',border:`1px solid rgba(196,137,42,0.15)`,borderRadius:6,padding:14}}>
//             <div style={{fontFamily:T.mono,fontSize:'0.5rem',color:'rgba(245,240,232,0.35)',letterSpacing:'0.2em',marginBottom:6}}>LOYALTY PROGRAM</div>
//             <div style={{fontSize:'0.84rem'}}>1,240 active members</div>
//             <div style={{fontFamily:T.mono,fontSize:'0.6rem',color:T.adminAmber,marginTop:4}}>87 new this month ↑</div>
//           </div>
//         </Panel>
//         <Panel title="Payment Methods">
//           {PAYMENTS.map((p,i)=>(
//             <div key={i} style={{marginBottom:14}}>
//               <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.82rem',marginBottom:3}}>
//                 <span>{p.name}</span><span style={{fontFamily:T.mono,fontSize:'0.63rem',color:p.color}}>{p.pct}%</span>
//               </div>
//               <ProgressBar value={p.pct} color={p.color} />
//             </div>
//           ))}
//         </Panel>
//       </div>
//     </div>
//   );
// }

// // ── Reviews ────────────────────────────────────────────────
// const INIT_REVIEWS = [
//   {id:1,author:'김민지 (Kim Minji)',  stars:5,platform:'Google',     date:'Feb 22',text:'The dalgona latte here is absolutely unreal. Perfect balance of sweetness — Seoul Brew\'s version is the best in the city.',reply:null,needsReply:true},
//   {id:2,author:'이준호 (Lee Junho)',  stars:5,platform:'Naver',      date:'Feb 21',text:'방문할 때마다 항상 기분이 좋아지는 카페예요. 바리스타분들이 너무 친절하고 커피 퀄리티도 최상급입니다!',reply:null,needsReply:true},
//   {id:3,author:'Sarah M. (Tourist)', stars:4,platform:'TripAdvisor', date:'Feb 20',text:'Incredible little gem in Seoul! The red bean waffle was my favorite thing I ate in Korea. Slightly pricey but absolutely worth it.',reply:'Thank you so much for visiting! We\'re thrilled the red bean waffle won your heart ☕',needsReply:false},
//   {id:4,author:'박수아 (Park Sooa)',  stars:3,platform:'Kakao',       date:'Feb 19',text:'커피는 맛있는데 주말 웨이팅이 너무 길어요. 예약 시스템이 있으면 좋겠어요!',reply:null,needsReply:true},
//   {id:5,author:'최동현 (Choi Dong)', stars:5,platform:'Google',      date:'Feb 18',text:'My go-to work cafe. The cold brew is phenomenal. Staff remember my order after 2 visits — that personal touch is rare in Seoul.',reply:'We love having you as a regular! See you tomorrow ☕',needsReply:false},
// ];

// export function Reviews() {
//   const { showToast } = useApp();
//   const [reviews, setReviews] = useState(INIT_REVIEWS);
//   const [replyOpen, setReplyOpen] = useState(false);
//   const [replyId, setReplyId] = useState(null);
//   const [replyText, setReplyText] = useState('');

//   const submit = () => {
//     setReviews(p=>p.map(r=>r.id===replyId?{...r,reply:replyText,needsReply:false}:r));
//     showToast('Reply posted!'); setReplyOpen(false);
//   };
//   const avg = (reviews.reduce((a,r)=>a+r.stars,0)/reviews.length).toFixed(1);
//   const stars = n => '★'.repeat(n)+'☆'.repeat(5-n);

//   return (
//     <div className="fade-up">
//       <StatsGrid cols={3}>
//         <StatCard label="Average Rating" value={avg+' ★'} />
//         <StatCard label="Total Reviews"  value={reviews.length} change="↑ 18 this month" changeType="up" />
//         <StatCard label="Need Reply"     value={reviews.filter(r=>r.needsReply).length} valueColor={T.adminAmber} />
//       </StatsGrid>
//       <Panel title="Recent Reviews">
//         {reviews.map(r=>(
//           <div key={r.id} style={{padding:'16px 0',borderBottom:'1px solid rgba(245,240,232,0.07)'}}>
//             <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
//               <div>
//                 <div style={{fontWeight:700,fontSize:'0.88rem'}}>{r.author}</div>
//                 <div style={{color:T.adminAmber,letterSpacing:2,marginTop:2}}>{stars(r.stars)}</div>
//               </div>
//               <div style={{textAlign:'right'}}>
//                 <div style={{fontFamily:T.mono,fontSize:'0.54rem',color:'rgba(245,240,232,0.33)'}}>{r.date} · {r.platform}</div>
//                 {r.needsReply && <div style={{marginTop:4}}><Badge type="prep">Needs Reply</Badge></div>}
//               </div>
//             </div>
//             <div style={{fontSize:'0.8rem',color:'rgba(245,240,232,0.7)',lineHeight:1.65}}>{r.text}</div>
//             {r.reply && (
//               <div style={{background:'rgba(196,137,42,0.08)',borderLeft:`2px solid ${T.adminAmber}`,padding:'10px 14px',marginTop:10,borderRadius:'0 6px 6px 0'}}>
//                 <div style={{fontFamily:T.mono,fontSize:'0.48rem',color:T.adminAmber,letterSpacing:'0.2em',marginBottom:4}}>SEOUL BREW REPLY</div>
//                 <div style={{fontSize:'0.78rem',color:'rgba(245,240,232,0.6)'}}>{r.reply}</div>
//               </div>
//             )}
//             {r.needsReply && (
//               <div style={{marginTop:10}}>
//                 <Btn variant="primary" size="sm" onClick={()=>{setReplyId(r.id);setReplyText('Thank you for your kind words! ☕');setReplyOpen(true);}}>Reply</Btn>
//               </div>
//             )}
//           </div>
//         ))}
//       </Panel>
//       <Panel title="Rating Breakdown">
//         <div style={{maxWidth:400}}>
//           {[5,4,3,2,1].map(n=>(
//             <div key={n} style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}>
//               <span style={{fontFamily:T.mono,fontSize:'0.68rem',width:14,color:T.adminAmber}}>{n}</span>
//               <div style={{flex:1}}><ProgressBar value={(reviews.filter(r=>r.stars===n).length/reviews.length)*100} /></div>
//               <span style={{fontFamily:T.mono,fontSize:'0.6rem',color:'rgba(245,240,232,0.4)'}}>{reviews.filter(r=>r.stars===n).length}</span>
//             </div>
//           ))}
//         </div>
//       </Panel>
//       <Modal title="Reply to Review" open={replyOpen} onClose={()=>setReplyOpen(false)}>
//         <FormGroup label="Your Reply"><textarea style={{...textareaStyle(),minHeight:100}} value={replyText} onChange={e=>setReplyText(e.target.value)} /></FormGroup>
//         <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:16}}>
//           <Btn variant="ghost" onClick={()=>setReplyOpen(false)}>Cancel</Btn>
//           <Btn variant="primary" onClick={submit}>Post Reply</Btn>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// // ── Settings ───────────────────────────────────────────────
// export function Settings() {
//   const { showToast } = useApp();
//   const [cafeInfo, setCafeInfo] = useState({name:'Seoul Brew Cafe',address:'서울시 마포구 홍대입구로 23, 2F',openTime:'08:00',closeTime:'22:00',phone:'02-1234-5678',instagram:'@seoulbrewcafe'});
//   const [notifs, setNotifs] = useState({newOrder:true,lowInv:true,resMinder:true,reviews:false,dailyReport:true});
//   const [pos,    setPos]    = useState({autoPrint:true,taxIncluded:true,tableMode:true,orderNotes:true});
//   const [addAdminOpen, setAddAdminOpen] = useState(false);
//   const ADMINS = [{name:'Jiyeon Park',role:'Manager',last:'Now',isYou:true},{name:'Minjun Kim',role:'Barista Lead',last:'2h ago'},{name:'Owner',role:'Super Admin',last:'Feb 20'}];

//   const SettingRow = ({label,desc,k,state,setState}) => (
//     <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'13px 0',borderBottom:'1px solid rgba(245,240,232,0.07)'}}>
//       <div><div style={{fontSize:'0.84rem'}}>{label}</div><div style={{fontFamily:T.mono,fontSize:'0.54rem',color:'rgba(245,240,232,0.33)',marginTop:3}}>{desc}</div></div>
//       <Toggle on={state[k]} onChange={v=>setState(p=>({...p,[k]:v}))} />
//     </div>
//   );

//   return (
//     <div className="fade-up">
//       <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
//         <Panel title="Cafe Information">
//           {[['Cafe Name','name'],['Address','address'],['Phone','phone'],['Instagram','instagram']].map(([l,k])=>(
//             <FormGroup key={k} label={l}><input style={inputStyle()} value={cafeInfo[k]} onChange={e=>setCafeInfo(p=>({...p,[k]:e.target.value}))} /></FormGroup>
//           ))}
//           <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
//             <FormGroup label="Open Time"><input type="time" style={inputStyle()} value={cafeInfo.openTime} onChange={e=>setCafeInfo(p=>({...p,openTime:e.target.value}))} /></FormGroup>
//             <FormGroup label="Close Time"><input type="time" style={inputStyle()} value={cafeInfo.closeTime} onChange={e=>setCafeInfo(p=>({...p,closeTime:e.target.value}))} /></FormGroup>
//           </div>
//           <Btn variant="primary" onClick={()=>showToast('Cafe info saved!')}>Save Changes</Btn>
//         </Panel>
//         <Panel title="Notifications">
//           <SettingRow label="New Order Alert"      desc="Sound + push on new order"      k="newOrder"    state={notifs} setState={setNotifs} />
//           <SettingRow label="Low Inventory Alert"  desc="Notify when stock below minimum" k="lowInv"      state={notifs} setState={setNotifs} />
//           <SettingRow label="Reservation Reminders"desc="30 min before reservation"       k="resMinder"  state={notifs} setState={setNotifs} />
//           <SettingRow label="New Reviews"           desc="Notify on new review"            k="reviews"     state={notifs} setState={setNotifs} />
//           <SettingRow label="Daily Revenue Report"  desc="Email at end of business day"    k="dailyReport" state={notifs} setState={setNotifs} />
//           <div style={{marginTop:16}}><Btn variant="primary" onClick={()=>showToast('Notification settings saved!')}>Save Preferences</Btn></div>
//         </Panel>
//       </div>
//       <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
//         <Panel title="POS Settings">
//           <SettingRow label="Auto-print Receipts"  desc="Print receipt for every order"    k="autoPrint"   state={pos} setState={setPos} />
//           <SettingRow label="Tax Included Pricing"  desc="Show VAT-included prices"          k="taxIncluded" state={pos} setState={setPos} />
//           <SettingRow label="Table Service Mode"    desc="Enable table-based ordering"       k="tableMode"   state={pos} setState={setPos} />
//           <SettingRow label="Allow Order Notes"     desc="Customers can add custom notes"    k="orderNotes"  state={pos} setState={setPos} />
//           <FormGroup label="Tax Rate (%)"><input style={{...inputStyle(),width:100}} defaultValue="10" /></FormGroup>
//           <Btn variant="primary" onClick={()=>showToast('POS settings saved!')}>Save</Btn>
//         </Panel>
//         <Panel title="Admin Accounts" action={<Btn variant="ghost" onClick={()=>setAddAdminOpen(true)}>+ Add Admin</Btn>}>
//           <Tbl headers={['Name','Role','Last Login','Action']}>
//             {ADMINS.map((a,i)=>(
//               <tr key={i}>
//                 <Td bold>{a.name}</Td><Td mono>{a.role}</Td><Td mono>{a.last}</Td>
//                 <Td>{a.isYou?<Badge type="ready">You</Badge>:<Btn variant="ghost" size="sm" onClick={()=>showToast('Edit admin…')}>Edit</Btn>}</Td>
//               </tr>
//             ))}
//           </Tbl>
//         </Panel>
//       </div>
//       <Panel title="⚠ Danger Zone">
//         {[['Clear All Orders','Permanently delete all order history'],['Reset Dashboard','Reset all settings to factory defaults']].map(([l,d])=>(
//           <div key={l} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'13px 0',borderBottom:'1px solid rgba(245,240,232,0.07)'}}>
//             <div><div style={{fontSize:'0.84rem'}}>{l}</div><div style={{fontFamily:T.mono,fontSize:'0.54rem',color:'rgba(245,240,232,0.33)',marginTop:3}}>{d}</div></div>
//             <Btn variant="danger" onClick={()=>{if(window.confirm(`Are you sure you want to ${l.toLowerCase()}?`))showToast(`${l} completed.`);}}>{l}</Btn>
//           </div>
//         ))}
//       </Panel>
//       <Modal title="Add Admin Account" open={addAdminOpen} onClose={()=>setAddAdminOpen(false)}>
//         <FormGroup label="Full Name"><input style={inputStyle()} placeholder="e.g. Soohyun Lee" /></FormGroup>
//         <FormGroup label="Email"><input type="email" style={inputStyle()} placeholder="staff@seoulbrew.com" /></FormGroup>
//         <FormGroup label="Role"><select style={selectStyle()}><option>Barista Lead</option><option>Server Lead</option><option>Kitchen Lead</option><option>Manager</option></select></FormGroup>
//         <FormGroup label="Temp Password"><input type="password" style={inputStyle()} placeholder="Set temporary password" /></FormGroup>
//         <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:16}}>
//           <Btn variant="ghost" onClick={()=>setAddAdminOpen(false)}>Cancel</Btn>
//           <Btn variant="primary" onClick={()=>{showToast('Admin account created!');setAddAdminOpen(false);}}>Create Account</Btn>
//         </div>
//       </Modal>
//     </div>
//   );
// }