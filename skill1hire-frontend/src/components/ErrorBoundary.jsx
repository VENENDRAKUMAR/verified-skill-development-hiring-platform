"use client";
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          textAlign: "center",
          background: "var(--bg)",
          color: "var(--text)",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: "rgba(239,68,68,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 24, fontSize: 28,
          }}>
            ⚠️
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            marginBottom: 8,
          }}>
            Something went wrong
          </h2>
          <p style={{
            color: "var(--text-2)",
            fontSize: 14,
            maxWidth: 400,
            marginBottom: 24,
            lineHeight: 1.6,
          }}>
            An unexpected error occurred. Please try refreshing the page or contact support if the issue persists.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: "12px 32px",
              background: "var(--amber)",
              color: "#06060a",
              border: "none",
              borderRadius: 14,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
