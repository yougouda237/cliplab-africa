// Studio Application Main Script

class MusicStudio {
  constructor() {
    this.currentGenre = 'afrobeats';
    this.tempo = 120;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 240; // 4 minutes in seconds
    this.tracks = {
      drums: { volume: 80, muted: false, solo: false },
      bass: { volume: 70, muted: false, solo: false },
      melody: { volume: 75, muted: false, solo: false }
    };
    this.effects = {
      reverb: 0,
      delay: 0,
      chorus: 0,
      compressor: 30
    };
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateTimeDisplay();
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchSection(e.target.closest('.nav-btn')));
    });

    // Transport Controls
    document.getElementById('btn-play').addEventListener('click', () => this.play());
    document.getElementById('btn-stop').addEventListener('click', () => this.stop());
    document.getElementById('btn-record').addEventListener('click', () => this.toggleRecord());

    // Playback Slider
    document.getElementById('playback-slider').addEventListener('input', (e) => {
      this.currentTime = (e.target.value / 100) * this.duration;
      this.updateTimeDisplay();
    });

    // Genre Selection
    document.querySelectorAll('.genre-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.selectGenre(e.target.closest('.genre-btn')));
    });

    // Tempo Control
    document.getElementById('tempo-input').addEventListener('change', (e) => {
      this.tempo = parseInt(e.target.value);
      document.getElementById('tempo-slider').value = this.tempo;
    });

    document.getElementById('tempo-slider').addEventListener('input', (e) => {
      this.tempo = parseInt(e.target.value);
      document.getElementById('tempo-input').value = this.tempo;
    });

    document.querySelector('.btn-tempo-down').addEventListener('click', () => {
      this.tempo = Math.max(60, this.tempo - 5);
      document.getElementById('tempo-input').value = this.tempo;
      document.getElementById('tempo-slider').value = this.tempo;
    });

    document.querySelector('.btn-tempo-up').addEventListener('click', () => {
      this.tempo = Math.min(200, this.tempo + 5);
      document.getElementById('tempo-input').value = this.tempo;
      document.getElementById('tempo-slider').value = this.tempo;
    });

    // Volume Controls for Tracks
    document.querySelectorAll('.volume-slider').forEach((slider, index) => {
      slider.addEventListener('input', (e) => this.updateTrackVolume(e, index));
    });

    // Mute/Solo Buttons
    document.querySelectorAll('.btn-mute').forEach((btn, index) => {
      btn.addEventListener('click', (e) => this.toggleMute(e, index));
    });

    document.querySelectorAll('.btn-solo').forEach((btn, index) => {
      btn.addEventListener('click', (e) => this.toggleSolo(e, index));
    });

    // Beat Selection
    document.querySelectorAll('.btn-use-beat').forEach(btn => {
      btn.addEventListener('click', (e) => this.useBeat(e.target.closest('.beat-card')));
    });

    // Effects Sliders
    document.querySelectorAll('.effects-grid .slider').forEach((slider, index) => {
      slider.addEventListener('input', (e) => this.updateEffect(e, index));
    });

    // Export Buttons
    document.querySelectorAll('.btn-export').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleExport(e.target.closest('.export-card')));
    });
  }

  switchSection(btn) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update sections
    const sectionId = btn.dataset.section + '-section';
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    // Update header
    const titles = {
      'studio': 'Studio Principal',
      'beats': 'Beats Pré-enregistrés',
      'instruments': 'Instruments',
      'effects': 'Effets Audio',
      'export': 'Exporter votre création'
    };
    document.getElementById('section-title').textContent = titles[btn.dataset.section];
  }

  play() {
    this.isPlaying = true;
    document.getElementById('btn-play').classList.add('active');
    this.simulatePlayback();
    this.showNotification('🎵 Lecture en cours...');
  }

  stop() {
    this.isPlaying = false;
    this.currentTime = 0;
    document.getElementById('btn-play').classList.remove('active');
    this.updateTimeDisplay();
    this.showNotification('⏹ Arrêté');
  }

  toggleRecord() {
    const btn = document.getElementById('btn-record');
    btn.classList.toggle('active');
    if (btn.classList.contains('active')) {
      this.showNotification('🔴 Enregistrement en cours...');
    } else {
      this.showNotification('✓ Enregistrement arrêté');
    }
  }

  simulatePlayback() {
    if (this.isPlaying && this.currentTime < this.duration) {
      this.currentTime += 0.016; // ~60fps
      this.updateTimeDisplay();
      requestAnimationFrame(() => this.simulatePlayback());
    } else if (this.currentTime >= this.duration) {
      this.stop();
    }
  }

  updateTimeDisplay() {
    const displayTime = Math.floor(this.currentTime);
    const minutes = Math.floor(displayTime / 60);
    const seconds = displayTime % 60;
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('current-time').textContent = timeStr;
    document.getElementById('playback-slider').value = (this.currentTime / this.duration) * 100;
    document.querySelector('.playback-time').textContent = timeStr;
  }

  selectGenre(btn) {
    document.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    this.currentGenre = btn.dataset.genre;
    this.showNotification(`🎵 Genre changé: ${btn.textContent}`);
  }

  updateTrackVolume(e, index) {
    const trackNames = ['drums', 'bass', 'melody'];
    const volume = e.target.value;
    const label = e.target.closest('.track-volume').querySelector('.volume-label');
    label.textContent = volume + '%';
    this.tracks[trackNames[index]].volume = volume;
  }

  toggleMute(e, index) {
    const trackNames = ['drums', 'bass', 'melody'];
    const btn = e.target.closest('.btn-mute');
    btn.classList.toggle('active');
    this.tracks[trackNames[index]].muted = btn.classList.contains('active');
  }

  toggleSolo(e, index) {
    const trackNames = ['drums', 'bass', 'melody'];
    const btn = e.target.closest('.btn-solo');
    btn.classList.toggle('active');
    this.tracks[trackNames[index]].solo = btn.classList.contains('active');
  }

  useBeat(card) {
    const beatName = card.querySelector('h4').textContent;
    const bpm = card.querySelector('.beat-bpm').textContent;
    this.showNotification(`✓ Beat "${beatName}" chargé! ${bpm}`);
  }

  updateEffect(e, index) {
    const effectNames = ['reverb', 'delay', 'chorus', 'compressor'];
    const value = e.target.value;
    const label = e.target.closest('.effect-card').querySelector('.value-display');
    label.textContent = value + '%';
    if (effectNames[index]) {
      this.effects[effectNames[index]] = value;
    }
  }

  handleExport(card) {
    const format = card.querySelector('h4').textContent;
    this.showNotification(`📥 Préparation de l'export en ${format}...`);
    
    setTimeout(() => {
      this.showNotification(`✓ Export en ${format} terminé!`);
    }, 2000);
  }

  showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(16, 185, 129, 0.95);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MusicStudio();
});