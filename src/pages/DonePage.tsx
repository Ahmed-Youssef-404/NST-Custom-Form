// pages/DonePage.tsx
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { AnimatedPage } from '../components/common/AnimatedPage';
import { useSurveyStore } from '../store/surveyStore';
import { useNavigate } from 'react-router-dom';

const whatsappContacts = [
  {
    id: 1,
    name: 'Omar Youssef',
    phone: '+201159169762',
    message: 'Hello%20I%20have%20a%20question%20about%20PulseSurvey',
  },
  {
    id: 2,
    name: 'Hana Mohamed',
    phone: '+201018590852',
    message: 'Hello%20I%20have%20a%20question%20about%20PulseSurvey',
  },
  {
    id: 3,
    name: 'Adel Mohamed',
    phone: '+201556129378',
    message: 'Hello%20I%20have%20a%20question%20about%20PulseSurvey',
  },
];


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
  const resetSurvey = useSurveyStore((s) => s.resetSurvey);
  const startSurvey = useSurveyStore((s) => s.startSurvey);
  const isSubmitted = useSurveyStore((s) => s.isSubmitted);
  const isFullyCompleted = useSurveyStore((state) => state.isFullyCompleted());
  const [hasCleaned, setHasCleaned] = useState(false);

  // 🔥 GUARD: منع الدخول لو الفورم مش مكتمل أو مش مرسل
  useEffect(() => {
    // لو الفورم مش مكتمل ومش مرسل، نروح للهوم
    // if (!isFullyCompleted && !isSubmitted) {
    //   navigate('/');
    //   return;
    // }

    // لو الفورم مكتمل بس مش مرسل (يعني دخل يدوي)، نروح للـ summary
    if (isFullyCompleted && !isSubmitted) {
      navigate('/summary');
      return;
    }

    // ✅ هنا بننظف الـ store بس من غير ما نعمل navigate
    if (isFullyCompleted && isSubmitted && !hasCleaned) {
      setHasCleaned(true);
      // ✅ نظف يدوياً من غير ما تستخدم handleReset عشان فيه navigate
      localStorage.removeItem("survey_state_v1");
      resetSurvey();
      startSurvey();
    }
  }, [isFullyCompleted, isSubmitted, navigate, resetSurvey, startSurvey, hasCleaned]);

  // منع الرجوع للخلف (يتنفذ بس لو احنا في الصفحة صح)
  useEffect(() => {
    if (!isSubmitted && !isFullyCompleted) return;

    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isSubmitted, isFullyCompleted]);

  // لو مش مؤهل، منعرضش حاجة (الـ guard هيعمل redirect)
  // if (!isSubmitted && !isFullyCompleted) {
  //   return null;
  // }

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
              Your responses have been submitted successfully. <br />
              <strong>We will Contact you after application period ends. </strong> <br />
              Thanks for your interest in joining us.
            </p>
          </motion.div>

          {/* Support cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4 px-4 mb-10"
          >
            {whatsappContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() =>
                  window.open(
                    `https://wa.me/${contact.phone}`,
                    '_blank'
                  )
                }
                className="glass-card rounded-2xl p-5 text-left cursor-pointer hover:scale-105 transition-transform"
              >
                {/* <MessageCircleCheckIcon size={20} className="mb-3" style={{ color: '#25D366' }} /> */}
                <img src="/whatsapp.svg" alt="whatsapp" width={30} className="mb-3" />
                <div className="text-sm font-semibold text-[var(--foreground)] mb-1">
                  {contact.name}
                </div>
                <div className="text-xs text-[var(--muted)]">
                  {contact.phone.replace(/^(\d{3})(\d{3})(\d{4})$/, '+$1 $2 $3')}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Restart - هنا بس اللي نستخدم handleReset عشان يحول للـ home */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => { navigate('/') }}
            className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl text-sm font-medium
              text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]
              hover:border-[var(--primary)]/40 hover:bg-[var(--surface-2)] transition-all"
          >
            <RotateCcw size={14} />
            Fill the form again
          </motion.button>
        </div>
      </div>
    </AnimatedPage>
  );
}