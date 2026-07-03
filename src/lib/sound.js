// Tiny synthesized sound + haptics — no audio files needed.
// Respects a persisted mute preference.

const KEY = 'driving-theory-sound';

export function soundEnabled() {
  return localStorage.getItem(KEY) !== 'off';
}
export function setSoundEnabled(on) {
  localStorage.setItem(KEY, on ? 'on' : 'off');
}

let ctx = null;
function audio() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  }
  return ctx;
}

function tone(freq, start, dur, type = 'sine', gain = 0.15) {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, ac.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, ac.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur);
}

function vibrate(pattern) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern);
}

export function playCorrect() {
  if (!soundEnabled()) return;
  tone(660, 0, 0.12, 'sine');
  tone(880, 0.1, 0.18, 'sine');
  vibrate(30);
}

export function playWrong() {
  if (!soundEnabled()) return;
  tone(200, 0, 0.18, 'triangle', 0.12);
  vibrate([20, 40, 20]);
}

export function playFinish() {
  if (!soundEnabled()) return;
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.25, 'sine'));
  vibrate([40, 30, 80]);
}

export function playLevelUp() {
  if (!soundEnabled()) return;
  [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.1, 0.3, 'triangle'));
  vibrate([50, 40, 50, 40, 100]);
}
