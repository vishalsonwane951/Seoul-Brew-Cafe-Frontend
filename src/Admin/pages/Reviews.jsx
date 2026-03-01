import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Panel, StatCard, StatsGrid, Btn, Badge, ProgressBar } from '../components/AdminUI';
import { Modal, FormGroup, textareaStyle } from '../components/SharedUI';
import { T } from '../globalstyle';

const INITIAL_REVIEWS = [
  {
    id: 1,
    author: 'Kim Minji',
    stars: 5,
    platform: 'Google',
    date: 'Feb 22',
    text: "The dalgona latte here is absolutely unreal. I've tried dalgona from so many cafes in Seoul but Seoul Brew's version has the perfect balance of sweetness. The interior is stunning too — very instagrammable but also genuinely cozy.",
    reply: null,
    needsReply: true,
  },
  {
    id: 2,
    author: 'Lee Junho',
    stars: 5,
    platform: 'Naver',
    date: 'Feb 21',
    text: '',
    reply: null,
    needsReply: true,
  },
  {
    id: 3,
    author: 'Sarah M. (Tourist)',
    stars: 4,
    platform: 'TripAdvisor',
    date: 'Feb 20',
    text: "Incredible little gem in Seoul! The red bean waffle was my favorite thing I ate in Korea. Slightly pricey but absolutely worth it. Staff spoke enough English which I appreciated.",
    reply: "Thank you so much for visiting! We're thrilled the red bean waffle won your heart. Hope to see you again on your next Seoul visit! ☕",
    needsReply: false,
  },
  
  {
    id: 5,
    author: 'Choi Donghyun',
    stars: 3,
    platform: 'Google',
    date: 'Feb 18',
    text: "My go-to work cafe. The cold brew is phenomenal and the wifi is solid. Staff remember my order after just 2 visits — that personal touch is rare in Seoul.",
    reply: "We love having you as a regular! Our team works hard to remember our favourite guests. See you tomorrow ☕",
    needsReply: false,
  },
];

export default function Reviews() {
  const { showToast } = useApp();
  const [reviews,    setReviews]    = useState(INITIAL_REVIEWS);
  const [replyOpen,  setReplyOpen]  = useState(false);
  const [replyId,    setReplyId]    = useState(null);
  const [replyText,  setReplyText]  = useState('');
  const [filterStar, setFilterStar] = useState('all');

  const filtered = filterStar === 'all' ? reviews : reviews.filter(r => r.stars === Number(filterStar));

  const openReply = (id) => {
    setReplyId(id);
    setReplyText('Thank you for your kind words! ☕');
    setReplyOpen(true);
  };

  const submitReply = () => {
    setReviews(prev => prev.map(r => r.id === replyId ? { ...r, reply: replyText, needsReply: false } : r));
    showToast('Reply posted!');
    setReplyOpen(false);
    setReplyText('');
    setReplyId(null);
  };

  const avg = (reviews.reduce((a, r) => a + r.stars, 0) / reviews.length).toFixed(1);
  const starRow = n => reviews.filter(r => r.stars === n).length;

  return (
    <div className="fade-up">
      <StatsGrid cols={3}>
        <StatCard label="Average Rating" value={`${avg} ★`} />
        <StatCard label="Total Reviews"  value={reviews.length} change="↑ 18 this month" changeType="up" />
        <StatCard label="Need Reply"     value={reviews.filter(r => r.needsReply).length} valueColor={T.adminAmber} />
      </StatsGrid>

      {/* Reviews List */}
      <Panel
        title="Recent Reviews"
        action={
          <select
            style={{ background: T.adminSurface, border:`1px solid rgba(196,137,42,0.22)`, borderRadius:4, padding:'6px 10px', color: T.adminCream, fontFamily: T.mono, fontSize:'0.58rem', outline:'none' }}
            value={filterStar}
            onChange={e => setFilterStar(e.target.value)}
          >
            <option value="all">All Ratings</option>
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
          </select>
        }
      >
        {filtered.map(r => (
          <div key={r.id} style={{ padding:'16px 0', borderBottom:'1px solid rgba(245,240,232,0.07)' }}>
            {/* Header row */}
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:'0.88rem' }}>{r.author}</div>
                <div style={{ color: T.adminAmber, letterSpacing:2, marginTop:2 }}>
                  {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily: T.mono, fontSize:'0.54rem', color:'rgba(245,240,232,0.33)' }}>
                  {r.date} · {r.platform}
                </div>
                {r.needsReply && <div style={{ marginTop:4 }}><Badge type="prep">Needs Reply</Badge></div>}
              </div>
            </div>

            {/* Review text */}
            <div style={{ fontSize:'0.8rem', color:'rgba(245,240,232,0.7)', lineHeight:1.65 }}>
              {r.text}
            </div>

            {/* Existing reply */}
            {r.reply && (
              <div style={{
                background: 'rgba(196,137,42,0.08)', borderLeft:`2px solid ${T.adminAmber}`,
                padding:'10px 14px', marginTop:10, borderRadius:'0 6px 6px 0',
              }}>
                <div style={{ fontFamily: T.mono, fontSize:'0.48rem', color: T.adminAmber, letterSpacing:'0.2em', marginBottom:4 }}>
                  SEOUL BREW REPLY
                </div>
                <div style={{ fontSize:'0.78rem', color:'rgba(245,240,232,0.6)' }}>{r.reply}</div>
              </div>
            )}

            {/* Reply button */}
            {r.needsReply && (
              <div style={{ marginTop:10 }}>
                <Btn variant="primary" size="sm" onClick={() => openReply(r.id)}>Reply</Btn>
              </div>
            )}
          </div>
        ))}
      </Panel>

      {/* Rating Breakdown */}
      <Panel title="Rating Breakdown">
        <div style={{ maxWidth:400 }}>
          {[5,4,3,2,1].map(n => (
            <div key={n} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
              <span style={{ fontFamily: T.mono, fontSize:'0.68rem', width:14, color: T.adminAmber }}>{n}</span>
              <div style={{ flex:1 }}>
                <ProgressBar value={(starRow(n) / reviews.length) * 100} />
              </div>
              <span style={{ fontFamily: T.mono, fontSize:'0.6rem', color:'rgba(245,240,232,0.4)', width:14, textAlign:'right' }}>
                {starRow(n)}
              </span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Reply Modal */}
      <Modal title="Reply to Review" open={replyOpen} onClose={() => setReplyOpen(false)}>
        <FormGroup label="Your Reply">
          <textarea
            style={{ ...textareaStyle(), minHeight:110 }}
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
          />
        </FormGroup>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:16 }}>
          <Btn variant="ghost" onClick={() => setReplyOpen(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={submitReply}>Post Reply</Btn>
        </div>
      </Modal>
    </div>
  );
}