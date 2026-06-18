// Read-aloud via the Web Speech API (SpeechSynthesis), Hebrew (he-IL).

export function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'he-IL';
  u.rate = 0.95;
  const heVoice = window.speechSynthesis
    .getVoices()
    .find((v) => v.lang?.toLowerCase().startsWith('he'));
  if (heVoice) u.voice = heVoice;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
