import { useState, useEffect } from "react";
import { colors, fonts } from "../tokens";
import Eyebrow from "../components/Eyebrow";
import API from '../services/api.js'

const Field = ({ label, children, error }) => (
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
    {error && (
      <div style={{
        fontFamily: fonts.sans,
        fontSize: "0.72rem",
        color: "#c0392b",
        marginTop: "6px",
        fontWeight: 400
      }}>
        {error}
      </div>
    )}
  </div>
);

//  Input Styles 
const inputStyle = (focused, hasError) => ({
  width: "100%", padding: "13px 14px",
  background: focused ? colors.white : colors.off,
  border: `1px solid ${hasError ? "#c0392b" : focused ? colors.ink : colors.line}`,
  borderRadius: 0,
  color: colors.ink, fontFamily: fonts.sans,
  fontSize: "0.88rem", fontWeight: 300,
  outline: "none",
  transition: "border-color 0.2s, background 0.2s",
  boxSizing: "border-box",
});

//  Form Inputs 
const FormInput = ({ name, type = "text", placeholder, value, onChange, onBlur, required, error }) => {
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
      onBlur={(e) => { setFocused(false); onBlur && onBlur(e); }}
      style={inputStyle(focused, !!error)}
    />
  );
};

const FormSelect = ({ name, value, onChange, onBlur, required, error, children }) => {
  const [focused, setFocused] = useState(false);
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      onFocus={() => setFocused(true)}
      onBlur={(e) => { setFocused(false); onBlur && onBlur(e); }}
      style={{ ...inputStyle(focused, !!error), cursor: "pointer" }}
    >
      {children}
    </select>
  );
};

//  Validation helpers 
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s()-]{7,15}$/;

const validateField = (name, value) => {
  switch (name) {
    case "name":
      if (!value.trim()) return "Please enter your full name.";
      if (value.trim().length < 2) return "Name looks too short.";
      return "";
    case "email":
      if (!value.trim()) return "Please enter your email address.";
      if (!EMAIL_RE.test(value.trim())) return "Please enter a valid email address.";
      return "";
    case "phone":
      if (value.trim() && !PHONE_RE.test(value.trim())) return "Please enter a valid phone number.";
      return "";
    case "date": {
      if (!value) return "Please select a date.";
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const picked = new Date(value);
      if (picked < today) return "Please pick a date from today onward.";
      return "";
    }
    case "time":
      if (!value) return "Please select a preferred time.";
      return "";
    default:
      return "";
  }
};

const REQUIRED_FIELDS = ["name", "email", "date", "time"];

const FIELD_LABELS = {
  name: "Name",
  customerName: "Name",
  email: "Email",
  phone: "Phone",
  date: "Date",
  time: "Time",
  guests: "Guests",
  notes: "Special requests",
  specialRequest: "Special requests",
  table: "Table",
};

// Turns backend errors (Mongoose validation strings or a structured
// { errors: { field: msg } } object) into a short "Field is required." message.
const getFriendlyServerError = (err) => {
  const data = err?.response?.data;

  // Structured field errors, e.g. { errors: { phone: "..." } }
  if (data?.errors && typeof data.errors === "object") {
    const field = Object.keys(data.errors)[0];
    if (field) return `${FIELD_LABELS[field] || field} is required.`;
  }

  const msg = data?.message || err?.message || "";

  // Mongoose style: "...validation failed: phone: Path `phone` is required."
  const pathMatch = msg.match(/Path `(\w+)` is required/i);
  if (pathMatch) {
    const field = pathMatch[1];
    return `${FIELD_LABELS[field] || field} is required.`;
  }

  // Generic "<field> is required" or "<field>: required"
  const genericMatch = msg.match(/^(\w+)\s*[:\-]?\s*is required/i) || msg.match(/(\w+)\s*[:\-]\s*required/i);
  if (genericMatch) {
    const field = genericMatch[1];
    return `${FIELD_LABELS[field] || field} is required.`;
  }

  return "Please fill in all required fields.";
};

//  Reservation Page 
const ReservationPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", time: "", guests: "2", notes: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [done, setDone] = useState(false);
  const [resId, setResId] = useState(null);
  const [info, setInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(v => ({ ...v, [name]: value }));
    // Live-clear/update error for fields the user has already touched
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateAll = () => {
    const nextErrors = {};
    Object.keys(form).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) nextErrors[key] = err;
    });
    setErrors(nextErrors);
    setTouched({ name: true, email: true, phone: true, date: true, time: true, guests: true, notes: true });
    return Object.keys(nextErrors).length === 0;
  };

  const isFormValid = REQUIRED_FIELDS.every((key) => !validateField(key, form[key]))
    && !validateField("phone", form.phone); // phone optional but must be valid if filled

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateAll()) {
      setSubmitError("Please fix the highlighted fields before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        date: form.date,
        time: form.time,
        guests: form.guests,
        specialRequest: form.notes.trim(),
        table: '-', // customer doesn't pick table, admin assigns it
      };

      const res = await API.post("/reservations", payload);
      setResId(res.data?.reservation?._id ?? null);
      setDone(true);
    } catch (err) {
      console.error("Reservation failed:", err);
      setSubmitError(getFriendlyServerError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", date: "", time: "", guests: "2", notes: "" });
    setErrors({});
    setTouched({});
    setSubmitError("");
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
            {/* Form Column */}
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
                <form onSubmit={handleSubmit} noValidate>
                  {submitError && (
                    <div style={{
                      background: "#fdecea",
                      border: "1px solid #c0392b",
                      color: "#c0392b",
                      padding: "12px 16px",
                      marginBottom: "20px",
                      fontFamily: fonts.sans,
                      fontSize: "0.82rem",
                    }}>
                      {submitError}
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <Field label="Full Name *" error={touched.name && errors.name}>
                      <FormInput
                        name="name"
                        placeholder="Kim Ji-ho"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        error={touched.name && errors.name}
                      />
                    </Field>
                    <Field label="Email Address *" error={touched.email && errors.email}>
                      <FormInput
                        name="email"
                        type="email"
                        placeholder="you@email.com"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        error={touched.email && errors.email}
                      />
                    </Field>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <Field label="Phone" error={touched.phone && errors.phone}>
                      <FormInput
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.phone && errors.phone}
                      />
                    </Field>
                    <Field label="No. of Guests">
                      <FormSelect name="guests" value={form.guests} onChange={handleChange}>
                        {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n===1 ? "Guest" : "Guests"}</option>)}
                      </FormSelect>
                    </Field>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <Field label="Date *" error={touched.date && errors.date}>
                      <FormInput
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        error={touched.date && errors.date}
                      />
                    </Field>
                    <Field label="Preferred Time *" error={touched.time && errors.time}>
                      <FormSelect
                        name="time"
                        value={form.time}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        error={touched.time && errors.time}
                      >
                        <option value="">Select time</option>
                        {["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM"].map(t => <option key={t} value={t}>{t}</option>)}
                      </FormSelect>
                    </Field>
                  </div>

                  <Field label="Special Requests">
                    <textarea
                      name="notes"
                      placeholder="Dietary needs, celebrations…"
                      value={form.notes}
                      onChange={handleChange}
                      style={{ ...inputStyle(false, false), minHeight: "90px" }}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={submitting || !isFormValid}
                    style={{
                      width: "100%",
                      padding: "15px",
                      background: (submitting || !isFormValid) ? colors.muted : colors.ink,
                      color: "#fff",
                      border: "none",
                      cursor: (submitting || !isFormValid) ? "not-allowed" : "pointer",
                    }}
                  >
                    {submitting ? "Submitting…" : "Confirm Reservation"}
                  </button>
                </form>
              )}
            </div>

            {/* Info Column */}
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