import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import {
  FiUser, FiShield, FiClock, FiLogOut,
  FiActivity, FiCheck,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

/* ── Server action — logout ──────────────────────────────── */
async function logoutAction() {
  'use server';
  const { clearAuthCookie } = await import('@/lib/auth');
  const { redirect }        = await import('next/navigation');
  clearAuthCookie();
  redirect('/login');
}

export default function Dashboard() {
  const user = getCurrentUser();
  if (!user) redirect('/login');

  const initial = user.name[0].toUpperCase();

  const stats = [
    {
      icon:  <FiUser     size={18} />,
      label: 'Username',
      value: user.name,
      sub:   `ID #${user.sub}`,
      color: '#34d399',
    },
    {
      icon:  <FiShield   size={18} />,
      label: 'Auth Method',
      value: 'JWT + bcrypt',
      sub:   'HttpOnly cookie',
      color: '#22d3ee',
    },
    {
      icon:  <FiClock    size={18} />,
      label: 'Session',
      value: '7 days',
      sub:   'Auto-renew on activity',
      color: '#a78bfa',
    },
    {
      icon:  <FiActivity size={18} />,
      label: 'Status',
      value: 'Active',
      sub:   'All systems nominal',
      color: '#fb923c',
    },
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'var(--c-bg)' }}
    >
      {/* Reuse background blobs inline (no client component needed here) */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="grid-overlay" />
        <div className="vignette" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">

        {/* ── Topbar ──────────────────────────────────── */}
        <header
          className="glass-card"
          style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}
        >
          <div
            className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between"
          >
            {/* Logo wordmark */}
            <div className="flex items-center gap-2">
              <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
                <path d="M24 2L44 14V34L24 46L4 34V14L24 2Z"
                  fill="url(#dg1)" fillOpacity="0.2" stroke="url(#dg2)" strokeWidth="1.5" />
                <circle cx="24" cy="24" r="4" fill="url(#dg3)" />
                <defs>
                  <linearGradient id="dg1" x1="4" y1="2" x2="44" y2="46" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10b981" /><stop offset="1" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="dg2" x1="4" y1="2" x2="44" y2="46" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#34d399" /><stop offset="1" stopColor="#22d3ee" />
                  </linearGradient>
                  <radialGradient id="dg3">
                    <stop stopColor="#34d399" /><stop offset="1" stopColor="#10b981" />
                  </radialGradient>
                </defs>
              </svg>
              <span
                className="font-display font-bold text-lg text-gradient-emerald"
                style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}
              >
                Nexus
              </span>
            </div>

            {/* Right: avatar + sign out */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl font-bold text-sm flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #0891b2)',
                    color: 'white',
                  }}
                >
                  {initial}
                </div>
                <span
                  className="hidden sm:block text-sm font-medium"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  {user.name}
                </span>
              </div>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="btn-ghost gap-1.5"
                  style={{ padding: '8px 14px', fontSize: 13 }}
                >
                  <FiLogOut size={14} />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* ── Main ────────────────────────────────────── */}
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">

          {/* Welcome banner */}
          <div className="mb-10 enter enter-1">
            <div className="badge badge-emerald mb-4">
              <HiSparkles size={12} />
              Authentication successful
            </div>
            <h1
              className="font-display text-4xl font-bold tracking-tight mb-2"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Welcome back,{' '}
              <span className="text-gradient-emerald">{user.name}</span>
            </h1>
            <p className="text-sub text-base">
              Your session is active and secured. Here your account overview.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 enter enter-2">
            {stats.map(({ icon, label, value, sub, color }) => (
              <div key={label} className="glass-card rounded-2xl p-5 stat-card">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: `${color}18`,
                    border:     `1px solid ${color}30`,
                    color,
                  }}
                >
                  {icon}
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>
                  {label}
                </p>
                <p style={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 2 }}>
                  {value}
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                  {sub}
                </p>
              </div>
            ))}
          </div>

          {/* Security summary card */}
          <div className="glass-card rounded-2xl p-6 enter enter-3">
            <h2
              className="font-display font-bold text-lg mb-5"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Security Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Password storage', detail: 'bcrypt hash (cost factor 12)', ok: true },
                { label: 'Session token',    detail: 'JWT, 7-day expiry, HttpOnly', ok: true },
                { label: 'Database',         detail: 'Aiven MySQL + SSL/TLS',        ok: true },
              ].map(({ label, detail, ok }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)' }}
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}
                  >
                    <FiCheck size={12} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>
                      {label}
                    </p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                      {detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Redirect notice — helpful if user lands here instead of custom URL */}
          <div
            className="mt-6 rounded-2xl p-5 enter enter-4 flex items-start gap-3"
            style={{
              background: 'rgba(245,158,11,0.06)',
              border:     '1px solid rgba(245,158,11,0.18)',
            }}
          >
            <HiSparkles size={16} style={{ color: '#fbbf24', flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
              <strong style={{ color: 'rgba(255,255,255,0.75)' }}>Developer note:</strong>{' '}
              This dashboard is the built-in fallback. Set{' '}
              <code
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12,
                  background: 'rgba(255,255,255,0.07)',
                  padding: '1px 6px',
                  borderRadius: 5,
                  color: '#34d399',
                }}
              >
                NEXT_PUBLIC_REDIRECT_URL
              </code>{' '}
              in your environment to redirect users to your own app after sign-in.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
