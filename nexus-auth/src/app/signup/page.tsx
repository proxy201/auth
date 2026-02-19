'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FiUser, FiLock, FiArrowRight, FiShield,
  FiCheck,
} from 'react-icons/fi';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

import { signupSchema, type SignupInput } from '@/lib/validation';
import SceneBg          from '@/components/ui/SceneBg';
import NexusLogo        from '@/components/ui/NexusLogo';
import InputField       from '@/components/ui/InputField';
import PasswordStrength from '@/components/ui/PasswordStrength';
import Toast            from '@/components/ui/Toast';

/* ── Security guarantees listed on the left panel ─────── */
const GUARANTEES = [
  { icon: <FiShield size={15} />, text: 'Passwords hashed with bcrypt (cost 12)' },
  { icon: <FiLock   size={15} />, text: 'JWT stored in HttpOnly cookie — XSS safe' },
  { icon: <FiCheck  size={15} />, text: 'SSL/TLS encrypted connection to Aiven MySQL' },
  { icon: <FiCheck  size={15} />, text: 'Timing-safe comparison prevents enumeration' },
];

export default function SignupPage() {
  const router = useRouter();
  const [loading,   setLoading]   = useState(false);
  const [toast,     setToast]     = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [pwWatch,   setPwWatch]   = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  /* Track password for strength indicator */
  const currentPw = watch('password', '');
  if (currentPw !== pwWatch) setPwWatch(currentPw);

  /* ── Submit ──────────────────────────────────────────── */
  const onSubmit = async (data: SignupInput) => {
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/signup', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        /* Show first validation error or server message */
        const firstErr =
          json.errors
            ? Object.values(json.errors as Record<string, string[]>)[0]?.[0]
            : undefined;
        setToast({
          msg:  firstErr ?? json.message ?? 'Registration failed. Please try again.',
          type: 'error',
        });
        return;
      }

      setToast({ msg: `Account created! Welcome, ${json.data.user.name} 🎉`, type: 'success' });
      setTimeout(() => {
        router.push(json.data.redirectUrl ?? '/dashboard');
      }, 1100);
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

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-10 flex items-center gap-8 lg:gap-14">

        {/* ── LEFT PANEL ──────────────────────────────── */}
    

        {/* ── RIGHT PANEL — form ─────────────────────── */}
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
                Create account
              </h2>
              <p className="text-muted text-sm">
                Takes 20 seconds. No card required.
              </p>
            </div>

            {/* Social (decorative) */}
  



            {/* ── Form ───────────────────────────────── */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">

              {/* Username */}
              <div className="enter enter-3">
                <InputField
                  label="Username"
                  type="text"
                  placeholder="choose_a_username"
                  autoComplete="username"
                  leftIcon={<FiUser size={15} />}
                  error={errors.name?.message}
                  hint="3–30 characters: letters, numbers, _ . -"
                  {...register('name')}
                />
              </div>

              {/* Password */}
              <div className="enter enter-4">
                <InputField
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  leftIcon={<FiLock size={15} />}
                  error={errors.password?.message}
                  {...register('password')}
                />
                <PasswordStrength password={pwWatch} />
              </div>

              {/* Confirm password */}
              <div className="enter enter-5">
                <InputField
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  leftIcon={<FiLock size={15} />}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2.5 enter enter-6">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="custom-check mt-0.5"
                />
                <label
                  htmlFor="terms"
                  style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', lineHeight: 1.55, cursor: 'pointer' }}
                >
                  I agree to the{' '}
                  <a href="#" style={{ color: '#34d399', fontWeight: 600 }}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" style={{ color: '#34d399', fontWeight: 600 }}>Privacy Policy</a>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary enter enter-7 flex items-center justify-center gap-2 mt-1"
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    Creating account…
                  </>
                ) : (
                  <>
                    Create Account
                    <FiArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Sign-in link */}
            <p
              className="text-center mt-6 enter enter-8"
              style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}
            >
              Already have an account?{' '}
              <Link
                href="/login"
                style={{ color: '#34d399', fontWeight: 600 }}
                className="transition-opacity hover:opacity-75"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Security footnote */}
          <p
            className="text-center mt-4 flex items-center justify-center gap-1.5 enter enter-8"
            style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}
          >
            <FiShield size={11} />
            Passwords encrypted with bcrypt before storage
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
