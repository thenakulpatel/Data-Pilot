import Link from "next/link";

import {
  Zap,
  ArrowRight,
  Clock,
  Database,
  Shield,
  Code2,
  CheckCircle2,
  ExternalLink,
  Store,
  GraduationCap,
  BarChart3,
  Users,
  MessageSquare,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import HomeNavbar from "@/components/navbar/HomeNavbar";

const FEATURES = [
  {
    icon: Clock,
    title: "30-Second Setup",
    desc: "From file upload to live API endpoint in under a minute — no config, no friction.",
    glow: "rgba(163,184,176,0.12)",
    border: "rgba(163,184,176,0.22)",
  },
  {
    icon: Shield,
    title: "API Key Auth",
    desc: "Separate API - key generated automatically for every Table.",
    glow: "rgba(163,184,176,0.12)",
    border: "rgba(163,184,176,0.22)",
  },
  {
    icon: Database,
    title: "Auto Schema",
    desc: "Column types (text, number, date, boolean) are inferred automatically from your data and can also be customised.",
    glow: "rgba(163,184,176,0.12)",
    border: "rgba(163,184,176,0.22)",
  },
  {
    icon: Sparkles,
    label: "AI Generation",
    desc: "Describe your application in plain English and generate relational database schemas instantly.",
    glow: "rgba(163,184,176,0.12)",
    border: "rgba(163,184,176,0.22)",
  },
  {
    icon: Code2,
    title: "Full CRUD",
    desc: "GET, POST, PUT, DELETE — all REST endpoints ready, with filtering and pagination.",
    glow: "rgba(163,184,176,0.12)",
    border: "rgba(163,184,176,0.22)",
  },
  {
    icon: MessageSquare,
    title: "AI Assistant",
    desc: "Chat with your data, Ask questions in natural language and retrieve accurate answers ",
    glow: "rgba(163,184,176,0.12)",
    border: "rgba(163,184,176,0.22)",
  },
];

const USE_CASES = [
  {
    icon: Store,
    label: "Small Business",
    headline: "Product catalog → live API",
    body: "Turn Excel product lists into a Webflow / Shopify data source with zero backend.",
  },
  {
    icon: Users,
    label: "No-Code Builders",
    headline: "Spreadsheet,CSV → Database",
    body: "Feed data from Excel/CSV ",
  },
  {
    icon: GraduationCap,
    label: "Students & Devs",
    headline: "Instant mock API for demos",
    body: "Upload a sample CSV, get a working endpoint in 30 seconds — skip writing a backend.",
  },
  {
    icon: Sparkles,
    label: "Vibers",
    headline: "Generate mock tables using AI",
    body: "Generate database using AI and realistic mock data and query that data.",
  },
];

const STATS = [
  { value: "~30s", label: "to live API" },
  { value: "4", label: "CRUD endpoints" },
  { value: "100%", label: "no-code" },
  { value: "24h", label: "data TTL" },
];

export default function Home() {
  return (
    <main
      className="
        relative
        overflow-hidden
        min-h-screen
      "
    >
      {/* ─── Navbar ──────────────────────────────────────── */}
      <HomeNavbar />

      {/* ─── Hero ────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.04] mb-6">
            <span className="text-white">
              Build your backend, not your boilerplate.
            </span>
          </h1>

          {/* Sub */}
          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-10">
            Upload a CSV or Excel file and get a fully-functional REST API with
            CRUD endpoints in seconds. No backend. No database. No code.
          </p>

          {/* CTA row */}
          <div className="flex items-center justify-center gap-4 flex-wrap mb-12">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 text-lg font-bold px-7 py-3.5 rounded-xl transition-all hover:scale-105 text-white"
              style={{
                background: "linear-gradient(135deg, #363434, #363434)",
                boxShadow:
                  "0 6px 10px rgba(255,255,255,0.08), 0 0 30px rgba(255,255,255,0.06)",
              }}
            >
              Start for free <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 flex-wrap text-xs text-white/35">
            {[
              "No credit card",
              "Works with .csv & .xlsx",
              "API keys included",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2
                  className="h-3.5 w-3.5"
                  style={{ color: "#A3B8B0" }}
                />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ────────────────────────────────────── */}
      <section className="relative py-10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p
              className="inline-block text-xs font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full mb-4"
              style={{
                color: "#A3B8B0",
                background: "rgba(163,184,176,0.08)",
                border: "1px solid rgba(163,184,176,0.18)",
              }}
            >
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white">
              Everything you need
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, glow, border }) => (
              <div
                key={title}
                className="rounded-2xl p-5 space-y-3 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: `radial-gradient(circle at top left, ${glow}, rgba(255,255,255,0.02))`,
                  border: `1px solid ${border}`,
                  boxShadow: `0 0 30px ${glow}`,
                }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: glow, border: `1px solid ${border}` }}
                >
                  <Icon className="h-5 w-5 text-white/80" />
                </div>
                <h3 className="font-bold text-sm text-white">{title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Use cases ───────────────────────────────────── */}
      <section
        className="relative py-20 border-t"
        style={{
          borderColor: "rgba(255,255,255,0.05)",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p
              className="inline-block text-xs font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full mb-4"
              style={{
                color: "#A3B8B0",
                background: "rgba(163,184,176,0.08)",
                border: "1px solid rgba(163,184,176,0.18)",
              }}
            >
              Who is this for?
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white">
              Built for everyone with data
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {USE_CASES.map(({ icon: Icon, label, headline, body }) => (
              <div
                key={label}
                className="rounded-2xl p-5 space-y-3 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                    style={{
                      background: "rgba(163,184,176,0.12)",
                      border: "1px solid rgba(163,184,176,0.22)",
                    }}
                  >
                    <Icon className="h-4 w-4" style={{ color: "#A3B8B0" }} />
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.12em]"
                    style={{ color: "rgba(163,184,176,0.7)" }}
                  >
                    {label}
                  </span>
                </div>
                <p className="font-semibold text-sm text-white leading-snug">
                  {headline}
                </p>
                <p className="text-xs text-white/40 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────────── */}
      <section className="relative py-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <div
            className="rounded-3xl p-10 sm:p-14 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(163,184,176,0.12), rgba(74,85,80,0.12))",
              border: "1px solid rgba(163,184,176,0.2)",
              boxShadow: "0 0 80px rgba(163,184,176,0.08)",
            }}
          >
            {/* Glow inside card */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 0%, rgba(163,184,176,0.15) 0%, transparent 60%)",
              }}
            />
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white relative mb-4">
              Ready to build your API?
            </h2>
            <p className="text-white/50 text-base mb-8 relative">
              Upload your spreadsheet or use AI and get a live API in under a
              minute. Completely free.
            </p>
            <a
              href="/signup"
              className="inline-flex items-center gap-2 text-lg font-bold px-8 py-3.5 rounded-xl relative transition-all hover:scale-105 text-white"
              style={{
                background: "linear-gradient(135deg, #363434, #363434)",
                boxShadow:
                  "0 6px 10px rgba(255,255,255,0.08), 0 0 30px rgba(255,255,255,0.06)",
              }}
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────── */}
      <footer
        className="border-t py-8"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <div
          className="
    mx-auto
    max-w-6xl

    flex
    flex-col

    items-center
    justify-center

    gap-3

    px-5
    sm:px-8

    text-center
  "
        >
          <div
            className="
      flex
      items-center
      gap-3
    "
          >
            <p
              className="
        text-xl
        text-white
      "
            >
              æ
            </p>

            <span
              className="
        text-lg
        font-semibold
        text-white
      "
            >
              Data - Pilot
            </span>
          </div>

          <p
            className="
      text-xs
      text-white/25
    "
          >
            © {new Date().getFullYear()} DataPilot. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
