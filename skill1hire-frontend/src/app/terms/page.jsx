"use client";
import { Navbar, Footer } from "@/components/layout/PublicLayout";

export default function TermsPage() {
  const S = ({ children }) => <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(1.4rem, 3vw, 1.8rem)", marginTop: 40, marginBottom: 12, color: "var(--text)" }}>{children}</h2>;
  const P = ({ children }) => <p style={{ fontSize: 14.5, lineHeight: 1.8, color: "var(--text-2)", marginBottom: 16 }}>{children}</p>;

  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--text)", background: "var(--bg)" }}>
      <Navbar />
      <section style={{ padding: "140px clamp(16px, 5vw, 64px) 80px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>Legal</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(2.4rem, 5vw, 3.6rem)", lineHeight: 1.1, marginBottom: 12 }}>
            Terms of <span className="text-gradient">Service</span>
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 32 }}>Last updated: April 2026</p>

          <P>Welcome to Skill1 Hire. By using our platform, you agree to these Terms of Service. Please read them carefully.</P>

          <S>1. Acceptance of Terms</S>
          <P>By creating an account or using any part of the Skill1 Hire platform, you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree, please do not use the platform.</P>

          <S>2. User Accounts</S>
          <P>You must provide accurate, current information during registration. You are responsible for maintaining the confidentiality of your credentials. One person may maintain only one account per role. We reserve the right to suspend accounts that violate these terms.</P>

          <S>3. Platform Usage</S>
          <P>Candidates agree to complete assessments honestly and submit original capstone work. HRs agree to post legitimate job openings and treat candidates fairly. Mentors agree to provide quality guidance and maintain professional conduct. Any form of cheating, plagiarism, or misrepresentation will result in immediate termination.</P>

          <S>4. Intellectual Property</S>
          <P>Content you create (capstone projects, profile information) remains your property. By submitting it, you grant Skill1 Hire a non-exclusive license to display it to potential employers and mentors. Platform code, design, branding, and assessment content are owned by Skill1 Hire.</P>

          <S>5. Verification & Badges</S>
          <P>Verified badges are earned through platform assessments and capstone reviews. We reserve the right to revoke badges if fraud or dishonesty is discovered. Badge status does not guarantee employment.</P>

          <S>6. Payments & Refunds</S>
          <P>Pro plan subscriptions are billed monthly or yearly. Cancellation takes effect at the end of the billing period. Mentor session payments are processed through the platform. Refund requests are handled on a case-by-case basis within 7 days of the transaction.</P>

          <S>7. Limitation of Liability</S>
          <P>Skill1 Hire is a platform connecting candidates, companies, and mentors. We do not guarantee employment outcomes, mentor quality beyond our rating system, or assessment accuracy. Our liability is limited to the amount you&apos;ve paid us in the last 12 months.</P>

          <S>8. Governing Law</S>
          <P>These terms are governed by the laws of India. Any disputes will be resolved through arbitration in Bengaluru, Karnataka.</P>

          <S>9. Contact</S>
          <P>For questions about these terms, contact us at legal@skill1hire.com.</P>
        </div>
      </section>
      <Footer />
    </div>
  );
}
