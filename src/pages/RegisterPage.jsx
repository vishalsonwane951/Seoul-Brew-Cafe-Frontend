import { useState } from "react";
import { C } from "../constants";
import API from '../services/api'
import {
    useGlobalStyles,
    BrandPanel,
    FormPanel,
    FormHeading,
    Field,
    PrimaryBtn,
} from "../components/SharedComponents";

/* ── Eye icons ── */
const EyeOpen = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3"
            stroke="currentColor" strokeWidth="1.8" />
    </svg>
);

const EyeOff = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="1" y1="1" x2="23" y2="23"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

/* ── Password field with show/hide toggle ── */
function PasswordField({ label, placeholder, value, onChange, error }) {
    const [show, setShow] = useState(false);

    return (
        <div style={{ marginBottom: 16 }}>
            <label style={{
                display: "block", fontSize: "0.68rem", fontWeight: 600,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: C.mocha, marginBottom: 6, fontFamily: "'DM Sans',sans-serif",
            }}>
                {label}
            </label>
            <div style={{ position: "relative" }}>
                <input
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="sb-input"
                    style={{
                        width: "100%", padding: "12px 42px 12px 15px",
                        border: `1.5px solid ${error ? "#c0392b" : "rgba(26,15,10,0.13)"}`,
                        borderRadius: 5, background: "white",
                        fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem",
                        color: C.espresso, outline: "none",
                        transition: "border-color 0.22s, box-shadow 0.22s",
                    }}
                />
                <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    style={{
                        position: "absolute", right: 12, top: "50%",
                        transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer",
                        color: "rgba(26,15,10,0.35)", padding: 2,
                        display: "flex", alignItems: "center",
                        transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = C.blush}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(26,15,10,0.35)"}
                >
                    {show ? <EyeOff /> : <EyeOpen />}
                </button>
            </div>
            {error && (
                <p style={{
                    fontSize: "0.71rem", color: "#c0392b",
                    marginTop: 4, fontFamily: "'DM Sans',sans-serif",
                }}>
                    {error}
                </p>
            )}
        </div>
    );
}

/* ── Success screen ── */
function SuccessScreen({ onGoToLogin }) {
    return (
        <div style={{
            textAlign: "center", animation: "sb-fadeUp 0.4s ease", padding: "48px 0",
        }}>
            <div style={{ fontSize: "3.2rem", marginBottom: 16 }}>☕</div>
            <h2 style={{
                fontFamily: "'Playfair Display',serif", fontSize: "1.75rem",
                color: C.espresso, marginBottom: 10,
            }}>
                Account Created!
            </h2>
            <p style={{
                color: "rgba(26,15,10,0.48)", fontSize: "0.9rem",
                fontFamily: "'DM Sans',sans-serif", lineHeight: 1.65,
                maxWidth: 280, margin: "0 auto 30px",
            }}>
                Welcome to Seoul Brew. Check your email to verify your account.
            </p>
            <button
                onClick={onGoToLogin}
                className="sb-btn-main"
                style={{
                    padding: "13px 36px", background: C.espresso, color: C.cream,
                    border: "none", borderRadius: 5, cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem",
                    fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                    transition: "background 0.3s",
                }}>
                Sign In Now
            </button>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   SEOUL BREW — Register Page
═══════════════════════════════════════════════ */
export default function RegisterPage({ setPage, onLoginSuccess }) {
    useGlobalStyles();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });

    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const set = (key) => (e) =>
        setForm((p) => ({
            ...p,
            [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
        }));

    const validate = () => {
        const errs = {};
        if (!form.firstName.trim()) errs.firstName = "Required";
        if (!form.lastName.trim())  errs.lastName  = "Required";
        if (!form.email)
            errs.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email))
            errs.email = "Invalid email";
        if (!form.phone)
            errs.phone = "Phone number is required";
        if (!form.password)
            errs.password = "Password is required";
        else if (form.password.length < 8)
            errs.password = "Min. 8 characters";
        if (!form.confirmPassword)
            errs.confirmPassword = "Please confirm your password";
        else if (form.password !== form.confirmPassword)
            errs.confirmPassword = "Passwords do not match";
        if (!form.agreeToTerms)
            errs.agreeToTerms = "You must agree to the terms to continue";
        return errs;
    };

    const handleSubmit = async () => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setErrors({});
        setLoading(true);

        try {
            const payload = {
                firstName:       form.firstName,
                lastName:        form.lastName,
                email:           form.email,
                phone:           form.phone,
                password:        form.password,
                confirmPassword: form.confirmPassword,
                agreeToTerms:    form.agreeToTerms,
            };

            const res = await API.post("/register", payload);

            // Save token if backend returns one
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }

            setSuccess(true);

            // Notify App so Nav shows profile icon
            if (onLoginSuccess) {
                onLoginSuccess({
                    name: res.data.user?.firstName || form.firstName,
                });
            }

        } catch (error) {
            setErrors({
                email:
                    error.response?.data?.message ||
                    "Registration failed. Try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{
                display: "flex", minHeight: "100vh",
                fontFamily: "'DM Sans',sans-serif",
                background: C.dark, overflow: "hidden",
            }}>
                <BrandPanel />
                <FormPanel>
                    <SuccessScreen onGoToLogin={() => setPage("login")} />
                </FormPanel>
            </div>
        );
    }

    return (
        <div style={{
            display: "flex", minHeight: "100vh",
            fontFamily: "'DM Sans',sans-serif",
            background: C.dark, overflow: "hidden",
        }}>
            <BrandPanel />

            <FormPanel>
                <FormHeading
                    title="Join Seoul Brew"
                    subtitle="Create your account and start your coffee journey"
                />

                {/* Name row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field
                        label="First Name"
                        placeholder="Minji"
                        value={form.firstName}
                        onChange={set("firstName")}
                        error={errors.firstName}
                    />
                    <Field
                        label="Last Name"
                        placeholder="Kim"
                        value={form.lastName}
                        onChange={set("lastName")}
                        error={errors.lastName}
                    />
                </div>

                <Field
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={set("email")}
                    error={errors.email}
                />

                <Field
                    label="Phone Number"
                    type="tel"
                    placeholder="+82 10 0000 0000"
                    value={form.phone}
                    onChange={set("phone")}
                    error={errors.phone}
                />

                {/* Password row — eye toggle on both fields */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <PasswordField
                        label="Password"
                        placeholder="Min. 8 chars"
                        value={form.password}
                        onChange={set("password")}
                        error={errors.password}
                    />
                    <PasswordField
                        label="Confirm"
                        placeholder="••••••••"
                        value={form.confirmPassword}
                        onChange={set("confirmPassword")}
                        error={errors.confirmPassword}
                    />
                </div>

                {/* Terms checkbox */}
                <div style={{ marginBottom: 18 }}>
                    <label style={{
                        display: "flex", alignItems: "flex-start", gap: 10,
                        cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                    }}>
                        <input
                            type="checkbox"
                            checked={form.agreeToTerms}
                            onChange={set("agreeToTerms")}
                            style={{
                                marginTop: 3, accentColor: C.blush,
                                width: 15, height: 15, cursor: "pointer", flexShrink: 0,
                            }}
                        />
                        <span style={{ fontSize: "0.77rem", color: "rgba(26,15,10,0.52)", lineHeight: 1.5 }}>
                            I agree to the{" "}
                            <a href="/terms" className="sb-link" style={{ color: C.blush, textDecoration: "none" }}>
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="/privacy" className="sb-link" style={{ color: C.blush, textDecoration: "none" }}>
                                Privacy Policy
                            </a>
                        </span>
                    </label>
                    {errors.agreeToTerms && (
                        <p style={{
                            fontSize: "0.71rem", color: "#c0392b",
                            marginTop: 4, fontFamily: "'DM Sans',sans-serif",
                        }}>
                            {errors.agreeToTerms}
                        </p>
                    )}
                </div>

                <PrimaryBtn onClick={handleSubmit} loading={loading}>
                    Create Account
                </PrimaryBtn>

                <p style={{
                    textAlign: "center", marginTop: 20, fontSize: "0.84rem",
                    color: "rgba(26,15,10,0.46)", fontFamily: "'DM Sans',sans-serif",
                }}>
                    Already have an account?{" "}
                    <span
                        onClick={() => setPage("login")}
                        className="sb-link"
                        style={{ color: C.blush, fontWeight: 600, textDecoration: "none", cursor: "pointer" }}
                    >
                        Sign in
                    </span>
                </p>
            </FormPanel>
        </div>
    );
}