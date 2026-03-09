import { useState, useEffect } from "react";
import { colors, fonts } from "../tokens";
import Eyebrow from "../components/Eyebrow";
import API from '../services/api.js'

const Field = ({ label, children }) => (
  <div style={{ marginBottom: "20px" }}>
    <label style={{
      display: "block",
      fontFamily: fonts.sans,
      fontSize: "0.68rem",
      letterSpacing: "3px",
      textTransform: "uppercase",
      color: colors.muted,
      marginBottom: "8px",
      fontWeight: 400
    }}>
      {label}
    </label>
    {children}
  </div>
);

//  Input Styles 
const inputStyle = (focused) => ({
  width: "100%", padding: "13px 14px",
  background: focused ? colors.white : colors.off,
  border: `1px solid ${focused ? colors.ink : colors.line}`,
  borderRadius: 0,
  color: colors.ink, fontFamily: fonts.sans,
  fontSize: "0.88rem", fontWeight: 300,
  outline: "none",
  transition: "border-color 0.2s, background 0.2s",
  boxSizing: "border-box",
});

//  Form Inputs 
const FormInput = ({ name, type = "text", placeholder, value, onChange, required }) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={inputStyle(focused)}
    />
  );
};

const FormSelect = ({ name, value, onChange, required, children }) => {
  const [focused, setFocused] = useState(false);
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ ...inputStyle(focused), cursor: "pointer" }}
    >
      {children}
    </select>
  );
};

//  Reservation Page 
const ReservationPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", time: "", guests: "2", notes: "" });
  const [done, setDone] = useState(false);
  const [resId, setResId] = useState(null);
  const [info, setInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);


  //  Fetch Café Info 
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoadingInfo(true);
        const res = await API.get("/cafe-info");
        setInfo(res.data);
      } catch (err) {
        console.error("Failed to fetch info:", err);
      } finally {
        setLoadingInfo(false);
      }
    };
    fetchInfo();
  }, []);

  const handleChange = (e) => setForm(v => ({ ...v, [e.target.name]: e.target.value }));

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      customerName: form.name,
      email: form.email,
      phone: form.phone,
      date: form.date,
      time: form.time,
      guests: form.guests,
      specialRequest: form.notes, // ✅ removed duplicate `notes` key
      table: '-',                 // ✅ customer doesn't pick table, admin assigns it
    };

    const res = await API.post("/reservations", payload);
    setResId(res.data.reservation._id); // ✅ was res.data.id, now matches your response shape
    setDone(true);
  } catch (err) {
    console.error("Reservation failed:", err);
    alert("Failed to place reservation.");
  }
};

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", date: "", time: "", guests: "2", notes: "" });
    setDone(false);
    setResId(null);
  };

  return (
    <div style={{ paddingTop: "72px", animation: "pageFade 0.4s ease forwards" }}>
      <style>{`
        @keyframes pageFade {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section style={{ background: colors.white, padding: "60px 56px 120px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Eyebrow text="Book a Visit" />
          <h2 style={{ fontFamily: fonts.serif, fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 400, color: colors.ink, lineHeight: 1.15, margin: "0 0 56px 0" }}>
            Reserve a <em style={{ fontStyle: "italic", color: colors.accent }}>Table</em>
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
            {/* ── Form Column ── */}
            <div>
              {done ? (
                <div style={{ textAlign: "center", padding: "64px 40px" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "20px" }}>✓</div>
                  <h3 style={{ fontFamily: fonts.serif, fontSize: "1.6rem", fontWeight: 400, color: colors.ink, marginBottom: "12px" }}>
                    Table Reserved!
                  </h3>
                  {resId && (
                    <div style={{ fontFamily: fonts.sans, fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", color: colors.accent, marginBottom: "12px" }}>
                      {resId}
                    </div>
                  )}
                  <p style={{ fontFamily: fonts.sans, fontSize: "0.88rem", color: colors.muted, lineHeight: 1.7, fontWeight: 300 }}>
                    A confirmation has been sent to {form.email}.<br />We look forward to welcoming you.
                  </p>
                  <button onClick={resetForm} style={{ marginTop: "32px", padding: "15px 36px", background: colors.ink, color: "#fff", border: "none", cursor: "pointer" }}>
                    New Reservation
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <Field label="Full Name">
                      <FormInput name="name" placeholder="Kim Ji-ho" value={form.name} onChange={handleChange} required />
                    </Field>
                    <Field label="Email Address">
                      <FormInput name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} required />
                    </Field>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <Field label="Phone">
                      <FormInput name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
                    </Field>
                    <Field label="No. of Guests">
                      <FormSelect name="guests" value={form.guests} onChange={handleChange}>
                        {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n===1 ? "Guest" : "Guests"}</option>)}
                      </FormSelect>
                    </Field>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <Field label="Date">
                      <FormInput name="date" type="date" value={form.date} onChange={handleChange} required />
                    </Field>
                    <Field label="Preferred Time">
                      <FormSelect name="time" value={form.time} onChange={handleChange} required>
                        <option value="">Select time</option>
                        {["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM"].map(t => <option key={t} value={t}>{t}</option>)}
                      </FormSelect>
                    </Field>
                  </div>

                  <Field label="Special Requests">
                    <textarea name="notes" placeholder="Dietary needs, celebrations…" value={form.notes} onChange={handleChange} style={{ ...inputStyle(false), minHeight: "90px" }} />
                  </Field>

                  <button type="submit" style={{ width: "100%", padding: "15px", background: colors.ink, color: "#fff", border: "none", cursor: "pointer" }}>
                    Confirm Reservation
                  </button>
                </form>
              )}
            </div>

            {/*  Info Column  */}
            <div>
              <div style={{ border:"1px solid #ccc", padding:"14px 20px", marginBottom:"16px", background: colors.off }}>
                <h4 style={{ fontFamily: fonts.sans, fontSize:"0.68rem", letterSpacing:"3px", textTransform:"uppercase", color: colors.muted }}>Opening Hours</h4>
                {loadingInfo ? <p>Loading…</p> :
                  info?.hours?.map(h => (
                    <div key={h.day} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0" }}>
                      <span>{h.day}</span>
                      <span>{h.time}</span>
                    </div>
                  ))
                }
              </div>

              <div style={{ border:"1px solid #ccc", padding:"14px 20px", marginBottom:"16px", background: colors.off }}>
                <h4 style={{ fontFamily:fonts.sans, fontSize:"0.68rem", letterSpacing:"3px", textTransform:"uppercase", color: colors.muted }}>Find Us</h4>
                {loadingInfo ? <p>Loading…</p> :
                  <>
                    {info?.address?.line1}<br />
                    {info?.address?.line2}<br />
                    {info?.phone}<br />
                    {info?.email}
                  </>
                }
              </div>

              <div style={{ height:"180px", background: colors.surface, border:"1px solid #ccc", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span>📍 {info?.address?.line2 ?? "Koregaon Park, Pune"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReservationPage;