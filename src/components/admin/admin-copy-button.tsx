"use client";

import { useState } from "react";

interface Props {
  value: string;
  label?: string;
  size?: number;
}

export default function AdminCopyButton({ value, label, size = 13 }: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {
      // fallback: select text
    });
  }

  return (
    <button
      onClick={handleCopy}
      title={`Copiar${label ? ` ${label}` : ""}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size + 8,
        height: size + 8,
        borderRadius: "0.3rem",
        border: copied
          ? "1px solid rgba(16,185,129,0.35)"
          : "1px solid rgba(184,117,20,0.22)",
        background: copied
          ? "rgba(16,185,129,0.08)"
          : "rgba(255,255,255,0.6)",
        color: copied ? "#10b981" : "#B87514",
        cursor: "pointer",
        padding: 0,
        flexShrink: 0,
        transition: "all 150ms ease",
      }}
      aria-label={`Copiar${label ? ` ${label}` : ""}`}
    >
      {copied ? (
        <svg
          width={size - 1}
          height={size - 1}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          width={size - 1}
          height={size - 1}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}
