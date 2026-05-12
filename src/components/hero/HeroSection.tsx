import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSurveyStore } from '../../store/surveyStore';
import { useProgress } from '@/hooks/useProgress';
import { surveySections } from '@/config/surveySections';

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  },
};

// ============================================================
// Canvas Stars — zero DOM nodes, single rAF loop
// ============================================================
function StarsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmall = window.innerWidth < 768;
    const COUNT = isSmall ? 60 : 220;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    interface Star {
      x: number; y: number; size: number;
      speed: number; opacity: number; opacityDelta: number;
    }

    const stars: Star[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.4 + 0.4,
      speed: Math.random() * 0.3 + 0.08,
      opacity: Math.random() * 0.5 + 0.2,
      opacityDelta: (Math.random() * 0.005 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
    }));

    let rafId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        // twinkle
        s.opacity += s.opacityDelta;
        if (s.opacity > 0.85 || s.opacity < 0.05) s.opacityDelta *= -1;

        // drift upward
        if (!prefersReduced) {
          s.y -= s.speed;
          if (s.y < -2) {
            s.y = canvas.height + 2;
            s.x = Math.random() * canvas.width;
          }
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity.toFixed(2)})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      resize();
      stars.forEach(s => {
        s.x = Math.random() * canvas.width;
        s.y = Math.random() * canvas.height;
      });
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}

// ============================================================
// Hero Section
// ============================================================
export function HeroSection() {
  const navigate = useNavigate();
  const { startSurvey } = useSurveyStore();
  const { totalSections } = useProgress();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const moveX = useTransform(smoothX, [0, window.innerWidth], [-100, 100]);
  const moveY = useTransform(smoothY, [0, window.innerHeight], [-100, 100]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleStart = () => {
    startSurvey();
    if (surveySections?.length > 0) {
      navigate(`${surveySections[0].route}`);
    }
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-black"
    >
      {/* Stars — Canvas-based, no DOM nodes */}
      <StarsCanvas />

      {/* Nebula Orbs — 2 divs فقط، مش مئات */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #3b82f6, transparent 70%)',
          x: moveX,
          y: moveY,
        }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }}
        animate={{ scale: [1.2, 1, 1.2], rotate: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="text-center max-w-4xl mx-auto relative z-10"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl font-mono font-bold uppercase tracking-wide leading-tight mb-8"
          style={{
            color: '#facc15',
            textShadow: `
              0px 1px 0px #ca8a04, 0px 2px 0px #b87a04, 0px 3px 0px #a66a04,
              0px 4px 0px #945a04, 0px 5px 0px #824a04, 0px 6px 0px #703a04,
              0px 7px 0px #5e2a04, 0px 8px 12px rgba(0,0,0,0.7),
              0px 0px 25px rgba(250,204,21,0.5), 0px 0px 50px rgba(250,204,21,0.25)
            `,
          }}
          animate={{
            color: ['#facc15', '#eab308', '#ca8a04', '#eab308', '#facc15'],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          Northern Stars Team
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-400 leading-relaxed max-w-xl mx-auto mb-12 font-light"
        >
          Whenever it's dark, It's our time to shine
        </motion.p>

        <motion.div variants={itemVariants}>
          <motion.button
            onClick={handleStart}
            whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(59,130,246,0.5)' }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full text-base font-semibold text-white overflow-hidden transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #bdae1f, #e09d32)',
              boxShadow: '0 0 20px rgba(59,130,246,0.3)',
            }}
          >
            <span>Let's Start</span>
            <motion.span className="group-hover:translate-x-1 transition-transform duration-200">
              <ArrowRight size={18} />
            </motion.span>
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          </motion.button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-10 mt-20 text-sm text-gray-500 font-mono"
        >
          {[
            { value: `${totalSections}`, label: 'Modules' },
            { value: '10 Min', label: 'Estimated Time' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="uppercase tracking-wider text-xs">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}