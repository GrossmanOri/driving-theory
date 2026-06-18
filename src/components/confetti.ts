import confetti from 'canvas-confetti';

function reducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Gentle celebratory burst. Respects prefers-reduced-motion. */
export function celebrate() {
  if (reducedMotion()) return;
  confetti({
    particleCount: 70,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#34c759', '#ffd60a', '#5ac8fa', '#ff9f0a'],
  });
}

/** Bigger burst for finishing a lesson or passing the exam. */
export function bigCelebrate() {
  if (reducedMotion()) return;
  const end = Date.now() + 800;
  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
