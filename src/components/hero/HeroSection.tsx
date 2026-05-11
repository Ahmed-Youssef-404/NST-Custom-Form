import { motion, useMotionValue, useSpring, useTransform, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSurveyStore } from '../../store/surveyStore';
import { useProgress } from '@/hooks/useProgress';

// تصحيح الأنواع لـ TypeScript
// const stagger: Variants = {
//   container: {
//     hidden: {},
//     show: {
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2
//       }
//     },
//   },
//   item: {
//     hidden: { opacity: 0, y: 30 },
//     show: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.7,
//         ease: "easeOut"
//       }
//     },
//   },
// };

// الحل الأفضل والأضمن لتجنب مشاكل الـ Types
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

// إنشاء مجموعة من النجوم العشوائية المحسّنة
const generateStars = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    size: Math.random() * 1.5 + 0.5,
    x: Math.random() * 100,
    y: Math.random() * 200,
    delay: Math.random() * 2,
    duration: Math.random() * 5 + 5,
  }));
};

const starsData = generateStars(350);

export function HeroSection() {
  const navigate = useNavigate();
  const { startSurvey } = useSurveyStore();
  const { sections, totalSections } = useProgress();

  // console.log(totalSections)


  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 2. جعل الحركة ناعمة (Spring physics)
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3. تحديد مدى الحركة (مثلاً يتحرك بمقدار 50px كحد أقصى)
  // تحويل إحداثيات الماوس من مكانها في الشاشة إلى إزاحة بسيطة
  const moveX = useTransform(smoothX, [0, window.innerWidth], [-100, 100]);
  const moveY = useTransform(smoothY, [0, window.innerHeight], [-100, 100]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  // إعادة تفعيل الـ hooks هنا
  const handleStart = () => {
    startSurvey();
    if (sections && sections.length > 0) {
      navigate(`${sections[0].route}`);
    }
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-black"
    >

      {/* 1. طبقة النجوم السريعة */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {starsData.map((star) => (
          <motion.div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.x}%`,
              top: `${star.y}%`,
              boxShadow: '0 0 2px rgba(255, 255, 255, 0.7)',
            }}
            animate={{
              y: ['0vh', '-100vh'],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* 2. هالات السديم (Nebula Orbs) */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #3b82f6, transparent 70%)',
          // transform: `translate(${moveX}px, ${moveY}px)`,
          x: moveX, // ربط الحركة بالماوس
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

      {/* المحتوى الرئيسي */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="text-center max-w-4xl mx-auto relative z-10"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl font-mono font-medium uppercase tracking-widest leading-tight mb-8 relative"
          style={{
            backgroundImage: 'linear-gradient(to right, #facc15 0%, #a78bfa 50%, #facc15 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 15px rgba(167, 139, 250, 0.3)',
          }}
          animate={{
            backgroundPosition: ['0% center', '-200% center'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          Northern Stars Team
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-400 leading-relaxed max-w-xl mx-auto mb-12 font-light"
        >
          Want to level up you programming skills?
          Join our journey in less than <span className="text-white font-medium">5 minutes</span>.
        </motion.p>

        <motion.div variants={itemVariants}>
          <motion.button
            onClick={handleStart}
            whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)' }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full text-base font-semibold text-white overflow-hidden transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #a78bfa)',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
            }}
          >
            <span>Launch Survey</span>
            <motion.span
              className="group-hover:translate-x-1 transition-transform duration-200"
            >
              <ArrowRight size={18} />
            </motion.span>

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
            { value: '5 Min', label: 'Estemated Time' },
            // { value: 'Secure', label: 'Data Protocol' },
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