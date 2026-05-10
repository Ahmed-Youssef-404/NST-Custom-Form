import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, RotateCcw, Mail, MessageSquare } from 'lucide-react';
import { AnimatedPage } from '../components/common/AnimatedPage';
import { useSurvey } from '../hooks/useSurvey';
import { useSurveyStore } from '../store/surveyStore';

// Simple confetti burst using canvas
function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: {
      x: number; y: number; vx: number; vy: number;
      color: string; size: number; angle: number; vr: number;
    }[] = [];

    const colors = ['#8b5cf6', '#60a5fa', '#fcd34d', '#34d399', '#f472b6'];

    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        angle: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.1,
      });
    }

    let animId: number;
    let opacity = 1;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      opacity = Math.max(0, opacity - 0.004);
      ctx.globalAlpha = opacity;

      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.angle += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });

      if (opacity > 0) {
        animId = requestAnimationFrame(draw);
      }
    };

    const timeout = setTimeout(() => {
      animId = requestAnimationFrame(draw);
    }, 400);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30"
    />
  );
}

export function DonePage() {
  const navigate = useNavigate();
  const { handleReset } = useSurvey();
  const isSubmitted = useSurveyStore((s) => s.isSubmitted);

  // Guard: only show this if actually submitted
  useEffect(() => {
    if (!isSubmitted) navigate('/');
  }, [isSubmitted, navigate]);

  return (
    <AnimatedPage>
      <ConfettiCanvas />
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg mx-auto text-center">
          {/* Animated checkmark */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="inline-flex mb-8"
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--primary)/20, var(--secondary)/20)',
                boxShadow: '0 0 60px var(--primary)/30',
                border: '2px solid var(--primary)/30',
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
              >
                <CheckCircle2 size={44} style={{ color: 'var(--primary)' }} strokeWidth={1.5} />
              </motion.div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h1 className="text-4xl font-black text-[var(--foreground)] mb-3">Thank You!</h1>
            <p className="text-[var(--muted)] leading-relaxed mb-10">
              Your responses have been submitted successfully. Your insights genuinely help us build better
              experiences. We appreciate your time.
            </p>
          </motion.div>

          {/* Support cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 gap-4 mb-10"
          >
            <div className="glass-card rounded-2xl p-5 text-left">
              <Mail size={20} className="mb-3" style={{ color: 'var(--primary)' }} />
              <div className="text-sm font-semibold text-[var(--foreground)] mb-1">Email us</div>
              <div className="text-xs text-[var(--muted)]">hello@pulsesurvey.io</div>
            </div>
            <div className="glass-card rounded-2xl p-5 text-left">
              <MessageSquare size={20} className="mb-3" style={{ color: 'var(--secondary)' }} />
              <div className="text-sm font-semibold text-[var(--foreground)] mb-1">Live chat</div>
              <div className="text-xs text-[var(--muted)]">Available Mon–Fri</div>
            </div>
          </motion.div>

          {/* Restart */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={handleReset}
            className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl text-sm font-medium
              text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]
              hover:border-[var(--primary)]/40 hover:bg-[var(--surface-2)] transition-all"
          >
            <RotateCcw size={14} />
            Take the survey again
          </motion.button>
        </div>
      </div>
    </AnimatedPage>
  );
}
