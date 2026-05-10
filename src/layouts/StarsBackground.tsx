import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const StarsBackground = () => {
  // توليد بيانات النجوم مرة واحدة فقط عند تحميل الموقع
  const stars = useMemo(() => {
    return Array.from({ length: 250 }).map((_, i) => ({
      id: i,
      size: Math.random() * 1.8 + 0.5, // أحجام متنوعة بين 0.5px و 2.3px
      x: Math.random() * 100, // موقع أفقي عشوائي
      y: Math.random() * 200, // موقع رأسي عشوائي
      duration: Math.random() * 15 + 10, // سرعة حركة هادئة (10-25 ثانية) تناسب خلفية الموقع
      delay: Math.random() * 10,
    }));
  }, []);

  return (
    // استخدام fixed inset-0 يضمن أن الخلفية تغطي الشاشة بالكامل وتظل ثابتة أثناء التمرير
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      
      {/* رسم النجوم */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            // إضافة توهج خفيف جداً لكل نجمة
            boxShadow: '0 0 2px rgba(255, 255, 255, 0.4)',
          }}
          animate={{
            // الحركة للأعلى لإعطاء إحساس بالعمق والإبحار
            y: [0, -800], 
            // وميض خفيف عشوائي
            opacity: [0.1, 0.5, 0.1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "linear",
            delay: star.delay,
          }}
        />
      ))}

      {/* إضافة تأثير "سديم" (Nebula) خفيف جداً في الزوايا لزيادة الجمالية */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(167, 139, 250, 0.1) 0%, transparent 40%)
          `
        }}
      />
    </div>
  );
};

// استخدام React.memo ضروري جداً هنا لمنع إعادة ريندر النجوم مع كل حركة في الموقع
export default React.memo(StarsBackground);