import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface SuccessAnimationProps {
  show: boolean;
  message?: string;
  onComplete?: () => void;
  duration?: number;
}

export function SuccessAnimation({
  show,
  message = "Success!",
  onComplete,
  duration = 2000
}: SuccessAnimationProps) {
  const [visible, setVisible] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; rotation: number; delay: number }>>([]);

  useEffect(() => {
    if (show) {
      setVisible(true);

      // Generate confetti particles
      const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: Math.random() * -100 - 50,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.3,
      }));
      setConfetti(particles);

      const timer = setTimeout(() => {
        setVisible(false);
        setConfetti([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      {/* Confetti */}
      {confetti.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-sm animate-confetti"
          style={{
            left: `calc(50% + ${particle.x}px)`,
            top: `calc(50% + ${particle.y}px)`,
            transform: `rotate(${particle.rotation}deg)`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Success Icon */}
      <div className="glass-card p-8 rounded-2xl border-2 border-green-500/50 shadow-2xl shadow-green-500/20 animate-scale-in">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <CheckCircle2 className="w-16 h-16 text-green-500 animate-scale-in" />
            <div className="absolute inset-0 animate-ping">
              <CheckCircle2 className="w-16 h-16 text-green-500 opacity-75" />
            </div>
          </div>
          <p className="text-xl font-bold text-green-500">{message}</p>
        </div>
      </div>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(500px) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
