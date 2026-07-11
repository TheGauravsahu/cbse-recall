import { useSettingsStore } from '../stores/settingsStore';

let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
};

/**
 * Play a synthesized sound effect using the Web Audio API.
 * @param {string} type - 'click' | 'correct' | 'wrong' | 'level_up' | 'achievement'
 */
export const playSFX = (type) => {
  const { soundEnabled } = useSettingsStore.getState();
  if (!soundEnabled) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const playTone = (frequency, duration, waveType = 'sine', startTime = 0, volume = 0.1) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = waveType;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + startTime);
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime + startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    switch (type) {
      case 'click':
        playTone(600, 0.06, 'sine', 0, 0.06);
        break;
        
      case 'correct':
        // Bright major third double chime
        playTone(523.25, 0.15, 'sine', 0, 0.08); // C5
        playTone(659.25, 0.3, 'sine', 0.08, 0.08); // E5
        break;
        
      case 'wrong':
        // Downward buzz
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.linearRampToValueAtTime(130, ctx.currentTime + 0.35); // F3ish
        
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
        break;
        
      case 'level_up':
        // Arpeggiated C-Major Chord: C4 - E4 - G4 - C5
        playTone(261.63, 0.15, 'triangle', 0, 0.08); // C4
        playTone(329.63, 0.15, 'triangle', 0.1, 0.08); // E4
        playTone(392.00, 0.15, 'triangle', 0.2, 0.08); // G4
        playTone(523.25, 0.45, 'sine', 0.3, 0.1);    // C5
        break;
        
      case 'achievement':
        // Sparkling high chime sequence
        playTone(783.99, 0.1, 'sine', 0, 0.04);     // G5
        playTone(1046.50, 0.1, 'sine', 0.06, 0.04);  // C6
        playTone(1318.51, 0.12, 'sine', 0.12, 0.04); // E6
        playTone(1567.98, 0.35, 'sine', 0.18, 0.06); // G6
        break;
        
      default:
        break;
    }
  } catch (error) {
    console.error("Audio Context play error:", error);
  }
};
