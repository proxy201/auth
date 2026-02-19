'use client';

interface Props { password: string }

interface StrengthResult {
  score:  number;   // 0-5
  label:  string;
  color:  string;
  width:  string;
}

function assess(pw: string): StrengthResult {
  if (!pw) return { score: 0, label: '', color: '', width: '0%' };

  let score = 0;
  if (pw.length >= 8)             score++;
  if (pw.length >= 12)            score++;
  if (/[A-Z]/.test(pw))          score++;
  if (/[a-z]/.test(pw))          score++;
  if (/[0-9]/.test(pw))          score++;
  if (/[^A-Za-z0-9]/.test(pw))   score++;

  const norm = Math.min(score, 5);

  const map: StrengthResult[] = [
    { score: 0, label: '',        color: 'transparent',          width: '0%'   },
    { score: 1, label: 'Weak',    color: '#f43f5e',              width: '20%'  },
    { score: 2, label: 'Fair',    color: '#f59e0b',              width: '40%'  },
    { score: 3, label: 'Good',    color: '#eab308',              width: '60%'  },
    { score: 4, label: 'Strong',  color: '#10b981',              width: '80%'  },
    { score: 5, label: 'Excellent','color': '#34d399',           width: '100%' },
  ];

  return { ...map[norm], score: norm };
}

export default function PasswordStrength({ password }: Props) {
  const result = assess(password);
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="strength-track">
        <div
          className="strength-fill"
          style={{ width: result.width, background: result.color }}
        />
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
          Password strength
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color: result.color }}>
          {result.label}
        </span>
      </div>
    </div>
  );
}
