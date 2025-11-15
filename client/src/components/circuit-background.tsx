import { useEffect, useRef } from 'react';
import { CircuitFlow } from '@/lib/sfs-circuit-flow';

export function CircuitBackground() {
  const circuitRef = useRef<CircuitFlow | null>(null);

  useEffect(() => {
    // Initialize circuit flow animation
    const canvas = document.getElementById('sfs-circuit');
    if (canvas && !circuitRef.current) {
      circuitRef.current = new CircuitFlow('sfs-circuit');
    }

    // Cleanup on unmount
    return () => {
      if (circuitRef.current) {
        circuitRef.current.destroy();
        circuitRef.current = null;
      }
    };
  }, []);

  return (
    <canvas
      id="sfs-circuit"
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: 0.4 }}
    />
  );
}
