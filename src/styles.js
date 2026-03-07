// Cybersecurity-themed design tokens and style helpers

export const colors = {
    bg: "#080c18", bgCard: "rgba(10,20,40,0.85)", bgGlass: "rgba(16,32,64,0.6)",
    border: "rgba(0,255,136,0.12)", borderHover: "rgba(0,255,136,0.3)",
    green: "#00ff88", greenDim: "#00cc6a", greenBg: "rgba(0,255,136,0.08)",
    cyan: "#00e5ff", cyanBg: "rgba(0,229,255,0.08)",
    red: "#ff3b5c", redBg: "rgba(255,59,92,0.1)",
    amber: "#ffb020", amberBg: "rgba(255,176,32,0.1)",
    purple: "#a855f7", purpleBg: "rgba(168,85,247,0.1)",
    text: "#e0f0e8", textDim: "#6b8f80", textMuted: "#3d5a4f",
    shield: "linear-gradient(135deg, #00ff88, #00e5ff)",
    accent: "linear-gradient(135deg, #00e5ff, #a855f7)",
    danger: "linear-gradient(135deg, #ff3b5c, #ff6b2b)",
};

export const glass = {
    background: colors.bgGlass, backdropFilter: "blur(20px)",
    border: "1px solid " + colors.border, borderRadius: 16, padding: 24,
};

export const input = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: "1px solid " + colors.border, fontSize: 14,
    background: "rgba(0,255,136,0.04)", color: colors.text,
    outline: "none", boxSizing: "border-box", fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
};

export const label = {
    display: "block", marginBottom: 6, fontSize: 11, color: colors.greenDim,
    fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5,
    fontFamily: "'JetBrains Mono', monospace",
};

export const sevConfig = {
    high: { color: colors.red, bg: colors.redBg, label: "CRITICAL" },
    medium: { color: colors.amber, bg: colors.amberBg, label: "WARNING" },
    low: { color: colors.green, bg: colors.greenBg, label: "LOW" },
};

export function elderlyOverrides(isElderly) {
    if (!isElderly) return {};
    return {
        fontSize: "18px", lineHeight: "1.8",
        "--base-font": "16px", "--heading-scale": "1.4",
    };
}
