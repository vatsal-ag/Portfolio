// Native Web Audio API Chime & Browser Notification System for Senior Caretaker

class AudioAlarmService {
  private audioCtx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Plays a multi-tone gentle chime sequence (E5 -> G5 -> C6 -> E6)
  playMedicationChime() {
    try {
      const ctx = this.getContext();
      const notes = [659.25, 783.99, 1046.50, 1318.51]; // E5, G5, C6, E6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.22);

        // Envelope: soft attack, gentle decay
        gain.gain.setValueAtTime(0, now + idx * 0.22);
        gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.22 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.22 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.22);
        osc.stop(now + idx * 0.22 + 1.0);
      });
    } catch (e) {
      console.warn('Audio chime playback error:', e);
    }
  }

  // Request browser Notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Show desktop notification
  showNotification(title: string, body: string, medicineName: string) {
    this.playMedicationChime();
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/medicine-icon.png',
          tag: `med-${medicineName}`,
          requireInteraction: true
        });
      } catch (e) {
        console.warn('Notification error:', e);
      }
    }
  }
}

export const audioAlarm = new AudioAlarmService();
