export function MarqueeSection() {
  const logos = [
    "Razorpay", "Groww", "CRED", "Meesho", "Zepto", "Slice", "PhonePe", "Jar", "Smallcase", "Freo",
    "Razorpay", "Groww", "CRED", "Meesho", "Zepto", "Slice", "PhonePe", "Jar", "Smallcase", "Freo"
  ];
  return (
    <div style={{ padding: "18px 0", overflow: "hidden", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="marquee-track">
        {logos.map((c, i) => (
          <span key={i} style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-3)", whiteSpace: "nowrap" }}>{c}</span>
        ))}
      </div>
    </div>
  );
}
