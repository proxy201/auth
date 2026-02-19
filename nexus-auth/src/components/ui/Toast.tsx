'use client';

import { useEffect, useState } from 'react';
import { FiCheckCircle, FiXCircle, FiX } from 'react-icons/fi';

interface Props {
  message: string;
  type:    'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  onClose,
  duration = 4500,
}: Props) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setLeaving(true);
      setTimeout(onClose, 350);
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const isOk     = type === 'success';
  const accent   = isOk ? '#34d399' : '#f87171';
  const bgAccent = isOk ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)';
  const bdAccent = isOk ? 'rgba(16,185,129,0.22)' : 'rgba(244,63,94,0.22)';

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 ${leaving ? 'opacity-0 translate-y-2' : 'toast-enter'}`}
      style={{ transition: 'opacity 0.3s, transform 0.3s', minWidth: 280, maxWidth: 380 }}
    >
      <div
        className="glass-card rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-2xl"
        style={{ background: bgAccent, borderColor: bdAccent }}
      >
        <span style={{ color: accent, flexShrink: 0 }}>
          {isOk
            ? <FiCheckCircle size={19} />
            : <FiXCircle     size={19} />
          }
        </span>

        <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.88)' }}>
          {message}
        </span>

        <button
          onClick={() => { setLeaving(true); setTimeout(onClose, 350); }}
          style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}
          className="transition-colors hover:text-white/60"
          aria-label="Dismiss"
        >
          <FiX size={16} />
        </button>
      </div>
    </div>
  );
}
