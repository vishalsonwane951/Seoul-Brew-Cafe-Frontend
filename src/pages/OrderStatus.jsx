import { useEffect, useState } from "react";
import socket from "../services/Soket";
import { colors, fonts } from "../tokens";

const STATUSES = ["Accepted", "Preparing", "Ready", "Delivered"];

const STATUS_MESSAGES = {
  Accepted: "Your order has been received. Our team will begin preparing it shortly.",
  Preparing: "Our baristas are crafting your order with care. It won't be long!",
  Ready: "Your order is ready! Please collect it at the counter.",
  Delivered: "Order delivered. Thank you for choosing Seoul Brew. Enjoy!",
};

export default function OrderStatus({ orderId }) {
  const [status, setStatus] = useState("Accepted");

  useEffect(() => {
    socket.on("orderStatusUpdated", (data) => {
      if (data.id === orderId) setStatus(data.status);
    });
    return () => socket.off("orderStatusUpdated");
  }, [orderId]);

  const activeIdx = STATUSES.indexOf(status);

  return (
    <div style={{
      paddingTop: "72px",
      padding: "clamp(16px, 4vw, 56px)",
      fontFamily: fonts.sans,
    }}>
      <style>{`
        .os-steps { display: flex; overflow-x: auto; scrollbar-width: none; }
        .os-steps::-webkit-scrollbar { display: none; }
        @media (max-width: 480px) {
          .os-card-inner { padding: 16px !important; }
          .os-header-row { flex-direction: column !important; gap: 12px !important; }
          .os-step-label { font-size: 0.58rem !important; }
          .os-step { min-width: 64px !important; padding: 12px 4px !important; }
        }
        @media (min-width: 481px) and (max-width: 768px) {
          .os-step-label { font-size: 0.62rem !important; }
        }
      `}</style>

      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <div style={{ width: "28px", height: "1px", background: colors.accent }} />
          <span style={{ fontSize: "0.68rem", letterSpacing: "4px", textTransform: "uppercase", color: colors.accent }}>
            Track Your Order
          </span>
        </div>

        <h2 style={{
          fontFamily: fonts.serif,
          fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
          fontWeight: 400,
          color: colors.ink,
          margin: "0 0 24px",
          lineHeight: 1.15,
        }}>
          Order <em style={{ fontStyle: "italic", color: colors.accent }}>Status</em>
        </h2>

        {/* Main Card */}
        <div className="os-card-inner" style={{
          background: colors.white,
          border: `1px solid ${colors.line}`,
          padding: "clamp(16px, 4vw, 32px)",
          marginBottom: "16px",
        }}>
          {/* Header Row */}
          <div className="os-header-row" style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "12px",
            marginBottom: "28px",
          }}>
            <div>
              <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: colors.muted, marginBottom: "6px" }}>
                Order ID
              </div>
              <div style={{ fontSize: "clamp(0.75rem, 2vw, 0.88rem)", color: colors.ink, wordBreak: "break-all" }}>
                {orderId}
              </div>
            </div>

            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              background: `${colors.accent}15`,
              border: `1px solid ${colors.accent}40`,
              fontSize: "0.72rem",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: colors.accent,
            }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: colors.accent }} />
              {status}
            </div>
          </div>

          {/* Step Tracker */}
          <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: colors.muted, marginBottom: "16px" }}>
            Progress
          </div>
          <div className="os-steps">
            {STATUSES.map((s, i) => {
              const isDone = i < activeIdx;
              const isActive = i === activeIdx;
              return (
                <div key={s} className="os-step" style={{
                  flex: 1,
                  minWidth: "80px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "8px 4px",
                  position: "relative",
                }}>
                  {/* Connector line */}
                  {i < STATUSES.length - 1 && (
                    <div style={{
                      position: "absolute",
                      top: "13px",
                      left: "calc(50% + 8px)",
                      right: "calc(-50% + 8px)",
                      height: "1.5px",
                      background: isDone ? colors.accent : colors.line,
                      transition: "background 0.4s",
                    }} />
                  )}

                  {/* Dot */}
                  <div style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    border: `1.5px solid ${isActive || isDone ? colors.accent : colors.line}`,
                    background: isActive || isDone ? colors.accent : "transparent",
                    marginBottom: "8px",
                    flexShrink: 0,
                    boxShadow: isActive ? `0 0 0 3px ${colors.accent}25` : "none",
                    transition: "all 0.3s",
                  }} />

                  {/* Label */}
                  <div className="os-step-label" style={{
                    fontSize: "0.63rem",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    textAlign: "center",
                    color: isActive || isDone ? colors.ink : colors.muted,
                    lineHeight: 1.3,
                    transition: "color 0.3s",
                  }}>
                    {s}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Message */}
        <div className="os-card-inner" style={{
          background: colors.off,
          border: `1px solid ${colors.line}`,
          padding: "clamp(14px, 3vw, 24px)",
        }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: colors.muted, marginBottom: "8px" }}>
            What's happening
          </div>
          <p style={{ fontSize: "clamp(0.82rem, 2vw, 0.9rem)", color: colors.body, fontWeight: 300, lineHeight: 1.8, margin: 0 }}>
            {STATUS_MESSAGES[status] || ""}
          </p>
        </div>

        <div style={{ textAlign: "center", marginTop: "14px", fontSize: "0.65rem", letterSpacing: "2px", textTransform: "uppercase", color: colors.muted }}>
          Live updates · Refreshes automatically
        </div>
      </div>
    </div>
  );
}