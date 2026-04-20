import { Space_Grotesk, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import ThemeProvider from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { SSEListener } from "@/hooks/useSSE";
import { SocketProvider } from "@/context/SocketContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata = {
  title: "Skill1 Hire — Where Proof Meets Opportunity",
  description: "India's first verified talent platform. Only pre-assessed, capstone-proven candidates get hired here.",
  keywords: "hiring, verified candidates, skill assessment, India jobs, tech hiring",
  openGraph: {
    title: "Skill1 Hire — Where Proof Meets Opportunity",
    description: "India's first verified talent platform.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${spaceGrotesk.variable} ${bricolage.variable}`}>
      <head>
        {/* Anton is kept as external since next/font doesn't support it well */}
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <SocketProvider>
              <ErrorBoundary>
                {children}
                <SSEListener />
              </ErrorBoundary>
              <Toaster
                position="top-right"
                theme="light"
              richColors
              expand={false}
              toastOptions={{
                style: { fontFamily: "var(--font-body)" },
                duration: 3500,
              }}
            />
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}