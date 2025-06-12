/**
 * Bulle Sensorielle - Main JavaScript Application
 * A sensory sanctuary web app for children with sensory sensitivities
 */

class BulleSensorielle {
    constructor() {
        this.currentSection = 'home';
        this.sounds = new Map();
        this.activeSounds = new Set();
        this.currentVisual = 'breathing';
        this.audioInitialized = false;
        this.timer = {
            duration: 0,
            remaining: 0,
            interval: null,
            isRunning: false
        };
        this.profiles = JSON.parse(localStorage.getItem('sensoryProfiles') || '[]');
        this.theme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        this.setupTheme();
        this.setupEventListeners();
        this.setupAudio();
        this.setupVisuals();
        this.loadProfiles();
        this.showMascotMessage('Bienvenue dans ta bulle sensorielle !', 3000);
    }

    /**
     * Setup theme management
     */
    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = this.theme === 'dark' ? '☀️' : '🌙';
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Quick actions
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const action = e.currentTarget.dataset.action;
                this.navigateToSection(action);
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });
        }

        // Enhanced sound controls with better event handling and audio context initialization
        document.querySelectorAll('.sound-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const soundId = btn.getAttribute('data-sound');
                console.log(`Sound button clicked: ${soundId}`);
                await this.toggleSound(soundId);
            });
        });
        
        // Add visual playing indicator
        this.addPlayingIndicators();

        // Volume controls
        document.querySelectorAll('.volume-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const soundId = e.target.dataset.sound;
                const volume = e.target.value;
                this.setVolume(soundId, volume);
                e.target.nextElementSibling.textContent = `${volume}%`;
            });
        });

        // Visual controls
        document.querySelectorAll('.visual-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const visual = e.currentTarget.dataset.visual;
                this.setVisual(visual);
            });
        });

        // Timer controls
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const minutes = parseInt(e.currentTarget.dataset.time);
                this.setTimerDuration(minutes);
            });
        });

        document.getElementById('customMinutes').addEventListener('change', (e) => {
            const minutes = parseInt(e.target.value);
            this.setTimerDuration(minutes);
        });

        document.getElementById('startTimer').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.startTimer();
        });

        document.getElementById('pauseTimer').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.pauseTimer();
        });

        document.getElementById('stopTimer').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.stopTimer();
        });

        // Profile management
        document.getElementById('saveProfile').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showSaveModal();
        });

        document.getElementById('cancelSave').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hideSaveModal();
        });

        document.getElementById('confirmSave').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.saveCurrentProfile();
        });

        // Modal background click
        document.getElementById('saveModal').addEventListener('click', (e) => {
            if (e.target.id === 'saveModal') {
                this.hideSaveModal();
            }
        });
    }

    /**
     * Setup audio system using Tone.js
     * Note: Audio context will be initialized on first user interaction
     */
    async setupAudio() {
        // Create sound generators (without starting audio context)
        this.createNoiseGenerators();
        this.createNatureSounds();
        this.createMelodies();
    }

    /**
     * Initialize audio context on first user interaction
     * This is required for Chrome's autoplay policy compliance
     */
    async initializeAudioContext() {
        if (!this.audioInitialized) {
            try {
                await Tone.start();
                this.audioInitialized = true;
                console.log('Audio context initialized successfully');
                return true;
            } catch (error) {
                console.error('Failed to initialize audio context:', error);
                return false;
            }
        }
        return true;
    }

    /**
     * Create noise generators (white, pink, brown noise)
     */
    createNoiseGenerators() {
        // White Noise
        const whiteNoise = new Tone.Noise('white').toDestination();
        whiteNoise.volume.value = -20;
        this.sounds.set('white-noise', whiteNoise);

        // Pink Noise
        const pinkNoise = new Tone.Noise('pink').toDestination();
        pinkNoise.volume.value = -20;
        this.sounds.set('pink-noise', pinkNoise);

        // Brown Noise
        const brownNoise = new Tone.Noise('brown').toDestination();
        brownNoise.volume.value = -20;
        this.sounds.set('brown-noise', brownNoise);
    }

    /**
     * Create nature sounds using Tone.js synthesizers and audio files
     */
    createNatureSounds() {
        // Campagne sound (audio file)
        const campagnePlayer = new Tone.Player({
            url: './sons/campagne.mp3',
            loop: true,
            autostart: false
        }).toDestination();
        campagnePlayer.volume.value = -20;
        this.sounds.set('campagne', campagnePlayer);

        // Forest sound (audio file)
        const forestPlayer = new Tone.Player({
            url: './sons/forest.mp3',
            loop: true,
            autostart: false
        }).toDestination();
        forestPlayer.volume.value = -20;
        this.sounds.set('forest', forestPlayer);

        // Ocean sound (audio file)
        const oceanPlayer = new Tone.Player({
            url: './sons/ocean.mp3',
            loop: true,
            autostart: false
        }).toDestination();
        oceanPlayer.volume.value = -20;
        this.sounds.set('ocean', oceanPlayer);

        // Rain sound (audio file)
        const rainPlayer = new Tone.Player({
            url: './sons/rain.mp3',
            loop: true,
            autostart: false
        }).toDestination();
        rainPlayer.volume.value = -20;
        this.sounds.set('rain', rainPlayer);

        // Chat sound (audio file)
        const chatPlayer = new Tone.Player({
            url: './sons/chat.mp3',
            loop: true,
            autostart: false
        }).toDestination();
        chatPlayer.volume.value = -20;
        this.sounds.set('chat', chatPlayer);

        // Feu sound (audio file)
        const feuPlayer = new Tone.Player({
            url: './sons/feu.mp3',
            loop: true,
            autostart: false
        }).toDestination();
        feuPlayer.volume.value = -20;
        this.sounds.set('feu', feuPlayer);
    }

    /**
     * Create melodic synthesizers
     */
    createMelodies() {
        // Soft piano
        const piano = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'sine' },
            envelope: { attack: 0.5, decay: 0.3, sustain: 0.8, release: 2 }
        }).toDestination();
        piano.volume.value = -15;
        this.sounds.set('piano', piano);

        // Lo-fi synth
        const lofi = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.8, decay: 0.5, sustain: 0.6, release: 3 }
        }).toDestination();
        lofi.volume.value = -18;
        this.sounds.set('lofi', lofi);

        // Start gentle melodies
        this.startMelodyPatterns();
    }

    /**
     * Start gentle melody patterns
     */
    startMelodyPatterns() {
        // Piano melody pattern
        const pianoPattern = new Tone.Pattern((time, note) => {
            if (this.activeSounds.has('piano')) {
                this.sounds.get('piano').triggerAttackRelease(note, '2n', time);
            }
        }, ['C4', 'E4', 'G4', 'C5', 'G4', 'E4'], 'up');
        pianoPattern.interval = '2n';
        pianoPattern.start(0);

        // Lo-fi melody pattern
        const lofiPattern = new Tone.Pattern((time, note) => {
            if (this.activeSounds.has('lofi')) {
                this.sounds.get('lofi').triggerAttackRelease(note, '4n', time);
            }
        }, ['A3', 'C4', 'E4', 'A4', 'E4', 'C4'], 'upDown');
        lofiPattern.interval = '4n';
        lofiPattern.start(0);

        // Start Tone.js transport
        Tone.Transport.bpm.value = 60;
        Tone.Transport.start();
    }

    /**
     * Setup visual animations
     */
    setupVisuals() {
        this.canvas = document.getElementById('visualCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.startVisualAnimation();
    }

    /**
     * Resize canvas to fit container
     */
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        this.canvas.width = Math.min(800, rect.width - 40);
        this.canvas.height = Math.min(600, rect.height - 40);
    }

    /**
     * Start visual animation loop
     */
    startVisualAnimation() {
        const animate = () => {
            this.renderCurrentVisual();
            requestAnimationFrame(animate);
        };
        animate();
    }

    /**
     * Render the current visual
     */
    renderCurrentVisual() {
        const { width, height } = this.canvas;
        this.ctx.clearRect(0, 0, width, height);

        switch (this.currentVisual) {
            case 'breathing':
                this.renderBreathingCircle();
                break;
            case 'colors':
                this.renderFloatingColors();
                break;
            case 'stars':
                this.renderStarRain();
                break;
            case 'mandala':
                this.renderRotatingMandala();
                break;
        }
    }

    /**
     * Render breathing guidance circle
     */
    renderBreathingCircle() {
        const { width, height } = this.canvas;
        const centerX = width / 2;
        const centerY = height / 2;
        const time = Date.now() * 0.001;
        const breathCycle = Math.sin(time * 0.5) * 0.5 + 0.5;
        const radius = 50 + breathCycle * 100;

        // Create gradient
        const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(191, 219, 254, 0.8)');
        gradient.addColorStop(1, 'rgba(233, 213, 255, 0.3)');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Add breathing text
        this.ctx.fillStyle = '#334155';
        this.ctx.font = '24px Nunito';
        this.ctx.textAlign = 'center';
        const phase = breathCycle > 0.5 ? 'Inspire...' : 'Expire...';
        this.ctx.fillText(phase, centerX, centerY + 8);
    }

    /**
     * Render floating colors
     */
    renderFloatingColors() {
        const { width, height } = this.canvas;
        const time = Date.now() * 0.0005;

        for (let i = 0; i < 5; i++) {
            const x = (Math.sin(time + i) * 0.3 + 0.5) * width;
            const y = (Math.cos(time * 0.7 + i * 2) * 0.3 + 0.5) * height;
            const radius = 80 + Math.sin(time * 2 + i) * 30;

            const colors = [
                'rgba(191, 219, 254, 0.6)',
                'rgba(233, 213, 255, 0.6)',
                'rgba(187, 247, 208, 0.6)',
                'rgba(254, 215, 170, 0.6)',
                'rgba(252, 231, 243, 0.6)'
            ];

            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, colors[i]);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    /**
     * Render star rain
     */
    renderStarRain() {
        const { width, height } = this.canvas;
        const time = Date.now() * 0.001;

        // Create dark background for night mode
        this.ctx.fillStyle = 'rgba(30, 41, 59, 0.1)';
        this.ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < 50; i++) {
            const x = (i * 137.5) % width;
            const y = ((time * 20 + i * 50) % (height + 100)) - 50;
            const size = 2 + Math.sin(time + i) * 1;
            const opacity = 0.3 + Math.sin(time * 2 + i) * 0.3;

            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    /**
     * Render rotating mandala
     */
    renderRotatingMandala() {
        const { width, height } = this.canvas;
        const centerX = width / 2;
        const centerY = height / 2;
        const time = Date.now() * 0.0005;

        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(time);

        const petals = 8;
        const radius = 100;

        for (let i = 0; i < petals; i++) {
            const angle = (i / petals) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 30);
            gradient.addColorStop(0, 'rgba(233, 213, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(233, 213, 255, 0.2)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 30, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    /**
     * Navigate to a specific section
     */
    navigateToSection(sectionId) {
        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        this.currentSection = sectionId;

        // Show relevant mascot messages
        this.showSectionMessage(sectionId);
    }

    /**
     * Show mascot message for specific sections
     */
    showSectionMessage(sectionId) {
        const messages = {
            home: 'Bienvenue dans ton espace de calme !',
            mixer: 'Choisis les sons qui t\'apaisent',
            visuals: 'Regarde ces jolis visuels relaxants',
            timer: 'Prends une pause bien méritée',
            profiles: 'Sauvegarde tes combinaisons préférées',
            tips: 'Voici des conseils pour ton bien-être'
        };

        this.showMascotMessage(messages[sectionId] || 'Explore ton sanctuaire !', 2000);
    }

    /**
     * Show mascot message
     */
    showMascotMessage(message, duration = 3000) {
        const mascotMessage = document.getElementById('mascotMessage');
        mascotMessage.textContent = message;
        mascotMessage.style.opacity = '1';
        mascotMessage.style.transform = 'translateX(0)';

        setTimeout(() => {
            mascotMessage.style.opacity = '0';
            mascotMessage.style.transform = 'translateX(20px)';
        }, duration);
    }

    /**
     * Toggle theme between light and dark
     */
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        
        this.showMascotMessage(`Mode ${this.theme === 'dark' ? 'nuit' : 'jour'} activé !`, 2000);
    }

    /**
     * Toggle sound on/off with enhanced state management
     * Initializes audio context on first interaction for Chrome compatibility
     */
    async toggleSound(soundId) {
        console.log(`Toggling sound: ${soundId}`);
        
        // Initialize audio context on first user interaction
        const audioReady = await this.initializeAudioContext();
        if (!audioReady) {
            console.error('Failed to initialize audio context');
            return;
        }
        
        const soundBtn = document.querySelector(`button[data-sound="${soundId}"]`);
        const soundControl = document.querySelector(`.sound-control[data-sound="${soundId}"]`);
        const sound = this.sounds.get(soundId);

        if (!sound || !soundBtn) {
            console.error(`Sound or button not found for: ${soundId}`);
            return;
        }

        // Check if this sound is currently active
        const isCurrentlyActive = this.activeSounds.has(soundId);
        
        if (isCurrentlyActive) {
            // Stop the current sound
            this.deactivateSound(soundId);
        } else {
            // Stop all sounds first, then start the new one
            this.deactivateAllSounds();
            this.activateSound(soundId);
        }
    }

    /**
     * Solution 2: Dedicated activation/deactivation functions
     * Activate a single sound with visual feedback
     */
    activateSound(soundId) {
        console.log(`Activating sound: ${soundId}`);
        const soundBtn = document.querySelector(`button[data-sound="${soundId}"]`);
        const soundControl = document.querySelector(`.sound-control[data-sound="${soundId}"]`);
        
        if (!soundBtn || !soundControl) return;
        
        // Start the sound
        this.startSound(soundId);
        
        // Add visual feedback
        soundBtn.classList.add('active');
        soundControl.classList.add('playing');
        
        // Update state
        this.activeSounds.add(soundId);
        
        console.log(`Sound ${soundId} activated. Active sounds:`, Array.from(this.activeSounds));
    }

    /**
     * Deactivate a single sound
     */
    deactivateSound(soundId) {
        console.log(`Deactivating sound: ${soundId}`);
        const soundBtn = document.querySelector(`button[data-sound="${soundId}"]`);
        const soundControl = document.querySelector(`.sound-control[data-sound="${soundId}"]`);
        
        if (!soundBtn || !soundControl) return;
        
        // Stop the sound
        this.stopSound(soundId);
        
        // Remove visual feedback
        soundBtn.classList.remove('active');
        soundControl.classList.remove('playing');
        
        // Hide playing indicator
        const indicator = soundControl.querySelector('.playing-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
        
        // Update state
        this.activeSounds.delete(soundId);
        
        console.log(`Sound ${soundId} deactivated. Active sounds:`, Array.from(this.activeSounds));
    }

    /**
     * Deactivate all currently playing sounds
     */
    deactivateAllSounds() {
        console.log('Deactivating all sounds');
        
        // Create a copy of active sounds to avoid modification during iteration
        const soundsToStop = Array.from(this.activeSounds);
        
        soundsToStop.forEach(soundId => {
            this.deactivateSound(soundId);
        });
        
        // Ensure all visual states are cleared
        document.querySelectorAll('.sound-btn.active').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll('.sound-control.playing').forEach(control => {
            control.classList.remove('playing');
        });
        
        // Hide all playing indicators
        document.querySelectorAll('.playing-indicator').forEach(indicator => {
            indicator.style.display = 'none';
        });
        
        // Clear the set
        this.activeSounds.clear();
        
        console.log('All sounds deactivated');
    }

    /**
     * Legacy function for compatibility
     */
    stopAllSounds() {
        this.deactivateAllSounds();
    }

    /**
     * Add visual playing indicators to sound controls
     */
    addPlayingIndicators() {
        document.querySelectorAll('.sound-control').forEach(control => {
            const soundId = control.getAttribute('data-sound');
            if (!control.querySelector('.playing-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'playing-indicator';
                indicator.innerHTML = '♪ En cours de lecture';
                indicator.style.cssText = `
                    display: none;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(34, 197, 94, 0.9);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    z-index: 10;
                `;
                control.style.position = 'relative';
                control.appendChild(indicator);
            }
        });
    }

    /**
     * Enhanced start sound function with better error handling
     */
    startSound(soundId) {
        const sound = this.sounds.get(soundId);
        if (!sound) {
            console.error(`Sound not found: ${soundId}`);
            return false;
        }

        try {
            if (sound.start) {
                sound.start();
            } else if (sound.noise && sound.lfo) {
                // For complex synthesized sounds (legacy)
                sound.noise.start();
                sound.lfo.start();
            }
            
            // Show playing indicator
            const control = document.querySelector(`.sound-control[data-sound="${soundId}"]`);
            const indicator = control?.querySelector('.playing-indicator');
            if (indicator) {
                indicator.style.display = 'block';
            }
            
            console.log(`Sound ${soundId} started successfully`);
            return true;
        } catch (error) {
            console.error(`Error starting sound ${soundId}:`, error);
            return false;
        }
    }

    /**
     * Enhanced stop sound function with indicator management
     */
    stopSound(soundId) {
        const sound = this.sounds.get(soundId);
        if (!sound) {
            console.error(`Sound not found: ${soundId}`);
            return false;
        }

        try {
            if (sound.stop) {
                sound.stop();
            } else if (sound.noise && sound.lfo) {
                // For complex synthesized sounds (legacy)
                sound.noise.stop();
                sound.lfo.stop();
            }
            
            // Hide playing indicator
            const control = document.querySelector(`.sound-control[data-sound="${soundId}"]`);
            const indicator = control?.querySelector('.playing-indicator');
            if (indicator) {
                indicator.style.display = 'none';
            }
            
            console.log(`Sound ${soundId} stopped successfully`);
            return true;
        } catch (error) {
            console.error(`Error stopping sound ${soundId}:`, error);
            return false;
        }
    }

    /**
     * Set volume for a specific sound
     */
    setVolume(soundId, volume) {
        const sound = this.sounds.get(soundId);
        if (!sound) return;

        const dbValue = -40 + (volume / 100) * 40; // Convert 0-100 to -40db to 0db
        
        if (sound.volume) {
            sound.volume.value = dbValue;
        } else if (sound.noise) {
            sound.noise.volume.value = dbValue;
        }
    }

    /**
     * Set current visual
     */
    setVisual(visualId) {
        document.querySelectorAll('.visual-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-visual="${visualId}"]`).classList.add('active');
        
        this.currentVisual = visualId;
        this.showMascotMessage(`Visual ${visualId} activé !`, 1500);
    }

    /**
     * Set timer duration
     */
    setTimerDuration(minutes) {
        this.timer.duration = minutes * 60;
        this.timer.remaining = this.timer.duration;
        this.updateTimerDisplay();
        
        document.getElementById('customMinutes').value = minutes;
    }

    /**
     * Start timer
     */
    startTimer() {
        if (this.timer.remaining <= 0) {
            const minutes = parseInt(document.getElementById('customMinutes').value) || 5;
            this.setTimerDuration(minutes);
        }

        this.timer.isRunning = true;
        this.timer.interval = setInterval(() => {
            this.timer.remaining--;
            this.updateTimerDisplay();
            this.updateTimerCircle();

            if (this.timer.remaining <= 0) {
                this.timerComplete();
            }
        }, 1000);

        document.getElementById('startTimer').disabled = true;
        document.getElementById('pauseTimer').disabled = false;
        document.getElementById('stopTimer').disabled = false;
        
        this.showMascotMessage('Minuteur démarré ! Profite de ta pause.', 2000);
    }

    /**
     * Pause timer
     */
    pauseTimer() {
        this.timer.isRunning = false;
        clearInterval(this.timer.interval);

        document.getElementById('startTimer').disabled = false;
        document.getElementById('pauseTimer').disabled = true;
        
        this.showMascotMessage('Minuteur en pause.', 1500);
    }

    /**
     * Stop timer
     */
    stopTimer() {
        this.timer.isRunning = false;
        clearInterval(this.timer.interval);
        this.timer.remaining = this.timer.duration;
        this.updateTimerDisplay();
        this.updateTimerCircle();

        document.getElementById('startTimer').disabled = false;
        document.getElementById('pauseTimer').disabled = true;
        document.getElementById('stopTimer').disabled = true;
        
        this.showMascotMessage('Minuteur arrêté.', 1500);
    }

    /**
     * Timer completion
     */
    timerComplete() {
        this.timer.isRunning = false;
        clearInterval(this.timer.interval);
        
        // Play gentle completion sound
        const completionTone = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.5, decay: 1, sustain: 0, release: 2 }
        }).toDestination();
        completionTone.triggerAttackRelease('C5', '2n');

        // Visual notification
        const timerCircle = document.getElementById('timerCircle');
        timerCircle.style.animation = 'breathe 1s ease-in-out 3';
        
        setTimeout(() => {
            timerCircle.style.animation = '';
        }, 3000);

        document.getElementById('startTimer').disabled = false;
        document.getElementById('pauseTimer').disabled = true;
        document.getElementById('stopTimer').disabled = true;
        
        this.showMascotMessage('Temps écoulé ! Bravo pour ta pause !', 4000);
    }

    /**
     * Update timer display
     */
    updateTimerDisplay() {
        const minutes = Math.floor(this.timer.remaining / 60);
        const seconds = this.timer.remaining % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timerTime').textContent = display;
    }

    /**
     * Update timer circle progress
     */
    updateTimerCircle() {
        const progress = (this.timer.duration - this.timer.remaining) / this.timer.duration;
        const degrees = progress * 360;
        const circle = document.getElementById('timerCircle');
        circle.style.background = `conic-gradient(var(--accent-blue) ${degrees}deg, var(--bg-accent) ${degrees}deg)`;
    }

    /**
     * Show save profile modal
     */
    showSaveModal() {
        document.getElementById('saveModal').classList.add('active');
        document.getElementById('profileName').focus();
    }

    /**
     * Hide save profile modal
     */
    hideSaveModal() {
        document.getElementById('saveModal').classList.remove('active');
        document.getElementById('profileName').value = '';
    }

    /**
     * Save current profile
     */
    saveCurrentProfile() {
        const name = document.getElementById('profileName').value.trim();
        if (!name) {
            this.showMascotMessage('Donne un nom à ta bulle !', 2000);
            return;
        }

        const profile = {
            id: Date.now(),
            name: name,
            sounds: Array.from(this.activeSounds),
            volumes: {},
            visual: this.currentVisual,
            timerDuration: this.timer.duration / 60,
            created: new Date().toLocaleDateString()
        };

        // Save volumes
        document.querySelectorAll('.volume-slider').forEach(slider => {
            profile.volumes[slider.dataset.sound] = slider.value;
        });

        this.profiles.push(profile);
        localStorage.setItem('sensoryProfiles', JSON.stringify(this.profiles));
        
        this.hideSaveModal();
        this.loadProfiles();
        this.showMascotMessage(`Bulle "${name}" sauvegardée !`, 3000);
    }

    /**
     * Load and display saved profiles
     */
    loadProfiles() {
        const profilesList = document.getElementById('profilesList');
        const profilesGrid = document.getElementById('profilesGrid');
        
        profilesList.innerHTML = '';
        profilesGrid.innerHTML = '';

        if (this.profiles.length === 0) {
            profilesList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Aucune bulle sauvegardée pour le moment.</p>';
            profilesGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Aucune bulle sauvegardée</p>';
            return;
        }

        this.profiles.forEach(profile => {
            const profileCard = this.createProfileCard(profile);
            profilesList.appendChild(profileCard.cloneNode(true));
            profilesGrid.appendChild(profileCard);
        });
    }

    /**
     * Create profile card element
     */
    createProfileCard(profile) {
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.innerHTML = `
            <div class="profile-name">${profile.name}</div>
            <div class="profile-details">
                <p><strong>Sons:</strong> ${profile.sounds.length > 0 ? profile.sounds.join(', ') : 'Aucun'}</p>
                <p><strong>Visual:</strong> ${profile.visual}</p>
                <p><strong>Minuteur:</strong> ${profile.timerDuration} min</p>
                <p><strong>Créé le:</strong> ${profile.created}</p>
            </div>
            <div class="profile-actions-buttons">
                <button type="button" class="profile-btn load" data-id="${profile.id}">Charger</button>
                <button type="button" class="profile-btn delete" data-id="${profile.id}">Supprimer</button>
            </div>
        `;

        // Add event listeners
        card.querySelector('.load').addEventListener('click', () => {
            this.loadProfile(profile.id);
        });

        card.querySelector('.delete').addEventListener('click', () => {
            this.deleteProfile(profile.id);
        });

        return card;
    }

    /**
     * Load a saved profile
     */
    loadProfile(profileId) {
        const profile = this.profiles.find(p => p.id === profileId);
        if (!profile) return;

        // Stop all current sounds
        this.activeSounds.forEach(soundId => {
            this.stopSound(soundId);
            document.querySelector(`[data-sound="${soundId}"]`).classList.remove('active');
        });
        this.activeSounds.clear();

        // Load sounds
        profile.sounds.forEach(soundId => {
            this.activeSounds.add(soundId);
            this.startSound(soundId);
            document.querySelector(`[data-sound="${soundId}"]`).classList.add('active');
        });

        // Load volumes
        Object.entries(profile.volumes).forEach(([soundId, volume]) => {
            const slider = document.querySelector(`[data-sound="${soundId}"]`);
            if (slider) {
                slider.value = volume;
                slider.nextElementSibling.textContent = `${volume}%`;
                this.setVolume(soundId, volume);
            }
        });

        // Load visual
        this.setVisual(profile.visual);

        // Load timer duration
        this.setTimerDuration(profile.timerDuration);

        this.showMascotMessage(`Bulle "${profile.name}" chargée !`, 3000);
    }

    /**
     * Delete a saved profile
     */
    deleteProfile(profileId) {
        const profile = this.profiles.find(p => p.id === profileId);
        if (!profile) return;

        if (confirm(`Supprimer la bulle "${profile.name}" ?`)) {
            this.profiles = this.profiles.filter(p => p.id !== profileId);
            localStorage.setItem('sensoryProfiles', JSON.stringify(this.profiles));
            this.loadProfiles();
            this.showMascotMessage(`Bulle "${profile.name}" supprimée.`, 2000);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BulleSensorielle();
});