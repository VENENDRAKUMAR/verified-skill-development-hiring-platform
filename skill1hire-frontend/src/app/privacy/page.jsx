"use client";
import { Navbar, Footer } from "@/components/layout/PublicLayout";

export default function PrivacyPage() {
  const S = ({ children }) => <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(1.4rem, 3vw, 1.8rem)", marginTop: 40, marginBottom: 12, color: "var(--text)" }}>{children}</h2>;
  const P = ({ children }) => <p style={{ fontSize: 14.5, lineHeight: 1.8, color: "var(--text-2)", marginBottom: 16 }}>{children}</p>;

  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--text)", background: "var(--bg)" }}>
      <Navbar />
      <section style={{ padding: "140px clamp(16px, 5vw, 64px) 80px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>Legal</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(2.4rem, 5vw, 3.6rem)", lineHeight: 1.1, marginBottom: 12 }}>
            Privacy <span className="text-gradient">Policy</span>
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 32 }}>Last updated: April 2026</p>

          <P>At Skill1 Hire, we take your privacy seriously. This Privacy Policy describes how we collect, use, and protect your personal information when you use our platform.</P>

          <S>1. Information We Collect</S>
          <P>We collect information you provide directly — such as your name, email, role, and profile details — as well as usage data like page views, assessment scores, and session activity. We may also collect device and browser information for analytics purposes.</P>

          <S>2. How We Use Your Information</S>
          <P>Your information is used to provide and improve our services, match candidates with relevant opportunities, enable mentor-candidate connections, send platform notifications, and maintain security. We never sell your personal data to third parties.</P>

          <S>3. Data Sharing</S>
          <P>We share limited profile data with HRs when you apply to jobs (e.g., verified scores, capstone projects). Mentor profiles are visible to candidates. We may share aggregated, anonymized data for analytics. Law enforcement requests are handled per applicable law.</P>

          <S>4. Data Security</S>
          <P>We implement industry-standard encryption (TLS/SSL), secure password hashing, and access controls. Assessment data and scores are stored securely. However, no system is 100% secure, and we cannot guarantee absolute security.</P>

          <S>5. Your Rights</S>
          <P>You can access, update, or delete your personal data at any time through your dashboard settings. You may request a full data export or account deletion by contacting us. We will respond within 30 days.</P>

          <S>6. Cookies</S>
          <P>We use essential cookies for authentication and session management. Analytics cookies help us understand platform usage. You can disable non-essential cookies through your browser settings.</P>

          <S>7. Changes to This Policy</S>
          <P>We may update this policy periodically. Significant changes will be communicated via email or platform notification. Continued use of the platform constitutes acceptance of the updated policy.</P>

          <S>8. Contact</S>
          <P>For questions about this privacy policy, please contact us at privacy@skill1hire.com.</P>
        </div>
      </section>
      <Footer />
    </div>
  );
}
