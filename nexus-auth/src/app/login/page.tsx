'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FiUser, FiLock, FiArrowRight, FiShield,
} from 'react-icons/fi';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

import { loginSchema, type LoginInput } from '@/lib/validation';
import SceneBg     from '@/components/ui/SceneBg';
import NexusLogo   from '@/components/ui/NexusLogo';
import InputField  from '@/components/ui/InputField';
import Toast       from '@/components/ui/Toast';

/* ── Testimonial shown on the left panel ─────────────────── */
const TESTIMONIAL = {
  text:   'Nexus makes access management effortless. The security is rock-solid and the UX is unmatched.',
  author: 'Riya Mehta',
  role:   'Lead Engineer, Arkive',
  avatar: 'RM',
};

const FEATURE_PILLS = ['End-to-end encrypted', 'bcrypt hashed', 'JWT sessions'];

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading]  = useState(false);
  const [toast,   setToast]    = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  /* ── Submit ──────────────────────────────────────────── */
  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setToast({ msg: json.message ?? 'Login failed. Please try again.', type: 'error' });
        return;
      }

      setToast({ msg: `Welcome back, ${json.data.user.name}! 👋`, type: 'success' });

      setTimeout(() => {
        router.push(json.data.redirectUrl ?? '/dashboard');
      }, 900);
    } catch {
      setToast({ msg: 'Network error — please check your connection.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  /* ── Render ──────────────────────────────────────────── */
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <SceneBg />

      {/* ── Two-column layout ─────────────────────────── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-10 flex items-center gap-8 lg:gap-14">

        {/* ── LEFT PANEL ──────────────────────────────── */}
        

        {/* ── RIGHT PANEL — form ───────────────────────── */}
        <div className="w-full max-w-[420px] mx-auto lg:mx-0 flex-shrink-0">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8 enter enter-1 flex justify-center">
            <NexusLogo size="md" />
          </div>

          <div className="glass-card rounded-3xl p-8 enter enter-2">

            {/* Header */}
            <div className="mb-7">
              <h2
                className="font-display text-2xl font-bold tracking-tight mb-1"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Sign in
              </h2>
              <p className="text-muted text-sm">
                Enter your credentials to continue
              </p>
            </div>

            {/* Social sign-in (decorative) */}
      

      

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">

              {/* Username */}
              <div className="enter enter-3">
                <InputField
                  label="Username"
                  type="text"
                  placeholder="your_username"
                  autoComplete="username"
                  leftIcon={<FiUser size={15} />}
                  error={errors.name?.message}
                  {...register('name')}
                />
              </div>

              {/* Password */}
              <div className="enter enter-4">
                <InputField
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  leftIcon={<FiLock size={15} />}
                  error={errors.password?.message}
                  {...register('password')}
                />
              </div>

              {/* Forgot password row */}
              <div className="flex items-center justify-between enter enter-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="custom-check" />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                    Keep me signed in
                  </span>
                </label>
                <a
                  href="#"
                  style={{ fontSize: 13, fontWeight: 600, color: '#34d399' }}
                  className="transition-opacity hover:opacity-75"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary enter enter-6 flex items-center justify-center gap-2 mt-1"
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <FiArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Sign-up link */}
            <p
              className="text-center mt-6 enter enter-7"
              style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}
            >
              New here?{' '}
              <Link
                href="/signup"
                style={{ color: '#34d399', fontWeight: 600 }}
                className="transition-opacity hover:opacity-75"
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* Security footnote */}
          <p
            className="text-center mt-4 flex items-center justify-center gap-1.5 enter enter-8"
            style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}
          >
            <FiShield size={11} />
            Protected by bcrypt · JWT · SSL/TLS
          </p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
