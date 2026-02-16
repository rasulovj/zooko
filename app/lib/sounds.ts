/**
 * Subtle UI sounds using Web Audio API — no external files needed.
 * Each sound is a short synthesized tone/effect.
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.12,
  ramp?: { to: number; time: number }
) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    if (ramp) osc.frequency.exponentialRampToValueAtTime(ramp.to, ctx.currentTime + ramp.time);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch { }
}

/** Soft click — for buttons, sidebar nav */
export function playClick() {
  playTone(800, 0.06, "sine", 0.03);
}

/** Success chime — quiz correct, lesson complete */
export function playSuccess() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = 0.04;
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + i * 0.12);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + 0.35 + i * 0.12);
    });
  } catch { }
}

/** Error buzz — wrong answer */
export function playError() {
  playTone(200, 0.2, "square", 0.025, { to: 150, time: 0.15 });
}

/** Soft wind whisper — for sidebar toggle, opening panels */
export function playPop() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.linearRampToValueAtTime(900, now + 0.15);
    filter.frequency.linearRampToValueAtTime(300, now + 0.35);
    filter.Q.value = 0.4;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.012, now + 0.08);
    gain.gain.setValueAtTime(0.012, now + 0.18);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.35);

    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.4);
  } catch { }
}

/** Level up / XP gain — ascending arpeggio */
export function playLevelUp() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    [440, 554, 659, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = 0.035;
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + i * 0.1);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + 0.45 + i * 0.1);
    });
  } catch { }
}

/** High-energy celebration — for big milestones or "wow" moments */
export function playCelebrate() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    // Ascending major arpeggio + shimmering high notes
    const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.1, now + i * 0.08 + 0.2);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.05, now + i * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.5);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + 0.6 + i * 0.08);
    });
  } catch { }
}

/** Notification ping */
export function playNotification() {
  playTone(1047, 0.15, "sine", 0.03);
}
