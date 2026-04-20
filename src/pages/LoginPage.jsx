import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../constants";
import API from '../services/api'
import axios from "axios";
import {
    useGlobalStyles,
    BrandPanel,
    FormPanel,
    FormHeading,
    Field,
    PrimaryBtn,
    OrDivider,
    GoogleBtn,
} from "../components/SharedComponents";

export default function LoginPage({ setUser }) {
    // ...
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
    const validate = () => {
        const errs = {};
        if (!form.email) errs.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email address";
        if (!form.password) errs.password = "Password is required";
        return errs;
    };

    const handleSubmit = async () => {
        
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setErrors({});
        setLoading(true);

        try {
           const res = await API.post("/login", { email: form.email, password: form.password });

            console.log("LOGIN RESPONSE:", res.data);

            if (res.data.token) {
                const userData = {
                    _id: res.data._id,
                    name: res.data.name,
                    email: res.data.email,
                    admin: res.data.admin,
                };

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(userData));

                // FIX: Single navigation based on admin status (removed duplicate navigate)
                setUser(userData);    
                navigate(res.data.admin === true ? '/admin' : '/');     
            } else {
                setErrors({ email: res.data.message || "Invalid email or password" });
            }

        } catch (err) {
            console.log("LOGIN ERROR:", err.response?.data);
            setErrors({ email: err.response?.data?.message || "Server error" });
        } finally {
            setLoading(false);
        }
    };
            const navigate = useNavigate()

    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                fontFamily: "'DM Sans',sans-serif",
                background: C.dark,
                overflow: "hidden",
            }}
        >
            <BrandPanel />
            <FormPanel>
                <FormHeading
                    title="Welcome back"
                    subtitle="Sign in to your Seoul Brew account"
                />

                <Field
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={set("email")}
                    error={errors.email}
                />

                <Field
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set("password")}
                    error={errors.password}
                    endAdornment={(
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            style={{
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                color: "#666"
                            }}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    )}
                />

                <div style={{ textAlign: "right", marginTop: -4, marginBottom: 20 }}>
                    <a
                        href="/forgot-password"
                        className="sb-link"
                        style={{
                            fontSize: "0.77rem",
                            color: C.blush,
                            textDecoration: "none",
                            fontFamily: "'DM Sans',sans-serif",
                        }}
                    >
                        Forgot password?
                    </a>
                </div>

                <PrimaryBtn onClick={handleSubmit} loading={loading}>
                    Sign In
                </PrimaryBtn>

                <OrDivider />
                <GoogleBtn />

                <p
                    style={{
                        textAlign: "center",
                        marginTop: 22,
                        fontSize: "0.84rem",
                        color: "rgba(26,15,10,0.46)",
                        fontFamily: "'DM Sans',sans-serif",
                    }}
                >
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate('/register')}
                        className="sb-link"
                        style={{ color: C.blush, fontWeight: 600, textDecoration: "none", cursor: "pointer" }}
                    >
                        Sign up
                    </span>
                </p>
            </FormPanel>
        </div>
    );
}