/**
 * Audio Module - Gestion des sons et de l'audio
 * Module autonome pour la gestion audio de l'application Bulle Sensorielle
 */

/**
 * Classe pour gérer l'audio de l'application
 */
class AudioManager {
    constructor() {
        this.currentAudio = null;
        this.currentToneSource = null;
        this.isPlaying = false;
        this.volume = 0.7;
        this.toneStarted = false;
        this.sounds = {
            'ocean': './sons/ocean.mp3',
            'rain': './sons/rain.mp3',
            'forest': './sons/forest.mp3',
            'feu': './sons/feu.mp3',
            'wind': './sons/wind.mp3',
            'water': './sons/water_flow.mp3',
            'birds': './sons/farm_birds.mp3',
            'underwater': './sons/underwater.mp3',
            'campfire': './sons/wild_fire_camp.mp3',
            'campagne': './sons/campagne.mp3',
            'chat': './sons/chat.mp3',
            'badweather': './sons/bad_weather.mp3',
            'gong': './sons/gong.mp3',
            'bubble': './sons/bubble.mp3',
            'berceuse': './sons/berceuse.mp3',
            'ballade': './sons/ballade.mp3'
        };
        // Generated sounds using Tone.js
        this.generatedSounds = {
            'white-noise': 'white',
            'pink-noise': 'pink',
            'brown-noise': 'brown',
            'piano': 'piano',
            'lofi': 'lofi'
        };
        this.init();
    }

    /**
     * Initialise le gestionnaire audio
     */
    init() {
        this.setupVolumeControl();
        this.bindEvents();
    }

    /**
     * Configure le contrôle de volume
     */
    setupVolumeControl() {
        // Setup individual volume sliders for each sound
        document.querySelectorAll('.volume-slider').forEach(slider => {
            const soundKey = slider.getAttribute('data-sound');
            slider.value = 50; // Default volume
            
            slider.addEventListener('input', (e) => {
                const volume = e.target.value / 100;
                this.setIndividualVolume(soundKey, volume);
                
                // Update volume display
                const volumeDisplay = e.target.nextElementSibling;
                if (volumeDisplay && volumeDisplay.classList.contains('volume-value')) {
                    volumeDisplay.textContent = `${e.target.value}%`;
                }
            });
        });
    }

    /**
     * Lie les événements aux boutons audio
     */
    bindEvents() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAudioButtons());
        } else {
            this.setupAudioButtons();
        }
    }

    /**
     * Configure les boutons audio
     */
    setupAudioButtons() {
        const audioButtons = document.querySelectorAll('[data-sound]');
        audioButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const soundKey = e.currentTarget.getAttribute('data-sound');
                this.toggleSound(soundKey, e.currentTarget);
            });
        });

        // Bouton stop global
        const stopButton = document.getElementById('stopAudio');
        if (stopButton) {
            stopButton.addEventListener('click', () => this.stopAll());
        }
    }

    /**
     * Joue ou arrête un son
     * @param {string} soundKey - Clé du son à jouer
     * @param {HTMLElement} button - Bouton qui a déclenché l'action
     */
    toggleSound(soundKey, button) {
        // Toujours arrêter le son actuel avant d'en jouer un nouveau
        this.stopCurrent();

        if (this.sounds[soundKey]) {
            this.playSound(soundKey, button);
        } else if (this.generatedSounds[soundKey]) {
            this.playGeneratedSound(soundKey, button);
        } else {
            console.warn(`Son non trouvé: ${soundKey}`);
        }
    }
    
    /**
     * Méthode pour compatibilité avec l'ancien système
     * @param {string} soundKey - Clé du son à jouer
     * @param {HTMLElement} button - Bouton qui a déclenché l'action
     */
    toggleAudio(soundKey, button) {
        this.toggleSound(soundKey, button);
    }

    /**
     * Joue un son spécifique
     * @param {string} soundKey - Clé du son à jouer
     * @param {HTMLElement} button - Bouton associé
     */
    playSound(soundKey, button) {
        try {
            this.currentAudio = new Audio(this.sounds[soundKey]);
            this.currentAudio.loop = true;
            
            // Use individual volume if set, otherwise use global volume
            const individualVolume = this.soundVolumes && this.soundVolumes[soundKey] ? this.soundVolumes[soundKey] : 0.5;
            this.currentAudio.volume = individualVolume;

            this.currentAudio.addEventListener('loadstart', () => {
                button.classList.add('loading');
            });

            this.currentAudio.addEventListener('canplay', () => {
                button.classList.remove('loading');
            });

            this.currentAudio.addEventListener('play', () => {
                this.isPlaying = true;
                this.updateButtonStates(button);
            });

            this.currentAudio.addEventListener('pause', () => {
                this.isPlaying = false;
                this.updateButtonStates();
            });

            this.currentAudio.addEventListener('ended', () => {
                this.isPlaying = false;
                this.updateButtonStates();
            });

            this.currentAudio.addEventListener('error', (e) => {
                console.error('Erreur de lecture audio:', e);
                button.classList.remove('loading');
                this.showError('Erreur lors de la lecture du son');
            });

            this.currentAudio.play().catch(error => {
                console.error('Erreur lors de la lecture:', error);
                this.showError('Impossible de lire le son. Cliquez d\'abord sur la page.');
            });

        } catch (error) {
            console.error('Erreur lors de la création de l\'audio:', error);
            this.showError('Erreur lors du chargement du son');
        }
    }
    
    /**
     * Initialise Tone.js si nécessaire
     */
    async initTone() {
        if (!this.toneStarted && typeof Tone !== 'undefined') {
            try {
                await Tone.start();
                this.toneStarted = true;
                console.log('Tone.js initialized successfully');
            } catch (error) {
                console.error('Error initializing Tone.js:', error);
                this.showError('Erreur d\'initialisation audio');
            }
        }
    }
    
    /**
     * Joue un son généré avec Tone.js
     * @param {string} soundKey - Clé du son à jouer
     * @param {HTMLElement} button - Bouton associé
     */
    async playGeneratedSound(soundKey, button) {
        if (typeof Tone === 'undefined') {
            this.showError('Tone.js n\'est pas disponible');
            return;
        }
        
        try {
            await this.initTone();
            
            button.classList.add('loading');
            
            const soundType = this.generatedSounds[soundKey];
            
            switch (soundType) {
                case 'white':
                case 'pink':
                case 'brown':
                    this.currentToneSource = new Tone.Noise(soundType).toDestination();
                    break;
                    
                case 'piano':
                    // Simple piano-like synth
                    this.currentToneSource = new Tone.PolySynth(Tone.Synth, {
                        oscillator: {
                            type: 'triangle'
                        },
                        envelope: {
                            attack: 0.02,
                            decay: 0.1,
                            sustain: 0.3,
                            release: 1
                        }
                    }).toDestination();
                    
                    // Play a gentle chord progression
                    const playChord = () => {
                        if (this.currentToneSource && this.isPlaying) {
                            const chords = [
                                ['C4', 'E4', 'G4'],
                                ['F4', 'A4', 'C5'],
                                ['G4', 'B4', 'D5'],
                                ['C4', 'E4', 'G4']
                            ];
                            const chord = chords[Math.floor(Math.random() * chords.length)];
                            this.currentToneSource.triggerAttackRelease(chord, '2n');
                            setTimeout(playChord, 3000 + Math.random() * 2000);
                        }
                    };
                    setTimeout(playChord, 1000);
                    break;
                    
                case 'lofi':
                    // Lo-fi ambient sound
                    this.currentToneSource = new Tone.Synth({
                        oscillator: {
                            type: 'sawtooth'
                        },
                        filter: {
                            frequency: 800,
                            rolloff: -24
                        },
                        envelope: {
                            attack: 2,
                            decay: 1,
                            sustain: 0.5,
                            release: 3
                        }
                    }).toDestination();
                    
                    // Add some reverb for ambient effect
                    const reverb = new Tone.Reverb(4).toDestination();
                    this.currentToneSource.connect(reverb);
                    
                    // Play ambient notes
                    const playAmbient = () => {
                        if (this.currentToneSource && this.isPlaying) {
                            const notes = ['C3', 'D3', 'E3', 'G3', 'A3'];
                            const note = notes[Math.floor(Math.random() * notes.length)];
                            this.currentToneSource.triggerAttackRelease(note, '4n');
                            setTimeout(playAmbient, 4000 + Math.random() * 3000);
                        }
                    };
                    setTimeout(playAmbient, 2000);
                    break;
                    
                default:
                    throw new Error(`Type de son généré non supporté: ${soundType}`);
            }
            
            // Set volume
            if (this.currentToneSource.volume) {
                this.currentToneSource.volume.value = Tone.gainToDb(this.volume);
            }
            
            // Start the source
            if (this.currentToneSource.start) {
                this.currentToneSource.start();
            }
            
            this.isPlaying = true;
            button.classList.remove('loading');
            this.updateButtonStates(button);
            
        } catch (error) {
            console.error('Erreur lors de la génération du son:', error);
            button.classList.remove('loading');
            this.showError('Erreur lors de la génération du son');
        }
    }

    /**
     * Arrête le son actuel
     */
    stopCurrent() {
        // Stop HTML5 Audio
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
        
        // Stop Tone.js sources
        if (this.currentToneSource) {
            try {
                this.currentToneSource.stop();
                this.currentToneSource.dispose();
            } catch (error) {
                console.warn('Error stopping Tone source:', error);
            }
            this.currentToneSource = null;
        }
        
        this.isPlaying = false;
        this.updateButtonStates();
    }

    /**
     * Arrête tous les sons
     */
    stopAll() {
        this.stopCurrent();
    }
    
    /**
     * Met en pause tous les sons
     */
    pauseAll() {
        if (this.currentAudio && this.isPlaying) {
            this.currentAudio.pause();
            this.isPlaying = false;
            this.updateButtonStates();
        }
    }
    
    /**
     * Reprend tous les sons en pause
     */
    resumeAll() {
        if (this.currentAudio && !this.isPlaying) {
            this.currentAudio.play().catch(error => {
                console.error('Erreur lors de la reprise:', error);
                this.showError('Erreur lors de la reprise du son');
            });
            this.isPlaying = true;
            this.updateButtonStates();
        }
    }

    /**
     * Définit le volume global
     * @param {number} volume - Volume entre 0 et 1
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.currentAudio) {
            this.currentAudio.volume = this.volume;
        }
        
        // Update Tone.js volume if applicable
        if (this.currentToneSource && this.currentToneSource.volume) {
            this.currentToneSource.volume.value = Tone.gainToDb(this.volume);
        }
    }
    
    /**
     * Définit le volume pour un son spécifique
     * @param {string} soundKey - Clé du son
     * @param {number} volume - Volume entre 0 et 1
     */
    setIndividualVolume(soundKey, volume) {
        const normalizedVolume = Math.max(0, Math.min(1, volume));
        
        // If this is the currently playing sound, update its volume
        if (this.currentAudio && this.isPlaying) {
            this.currentAudio.volume = normalizedVolume;
        }
        
        // Store volume for this sound for future use
        if (!this.soundVolumes) {
            this.soundVolumes = {};
        }
        this.soundVolumes[soundKey] = normalizedVolume;
    }

    /**
     * Met à jour l'état visuel des boutons
     * @param {HTMLElement} activeButton - Bouton actuellement actif
     */
    updateButtonStates(activeButton = null) {
        const audioButtons = document.querySelectorAll('[data-sound]');
        audioButtons.forEach(button => {
            button.classList.remove('active');
        });

        if (activeButton && this.isPlaying) {
            activeButton.classList.add('active');
        }
    }

    /**
     * Affiche un message d'erreur
     * @param {string} message - Message d'erreur à afficher
     */
    showError(message) {
        // Créer ou mettre à jour un élément d'erreur
        let errorElement = document.getElementById('audioError');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'audioError';
            errorElement.className = 'audio-error';
            errorElement.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff6b6b;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                z-index: 1000;
                font-size: 14px;
                max-width: 300px;
            `;
            document.body.appendChild(errorElement);
        }

        errorElement.textContent = message;
        errorElement.style.display = 'block';

        // Masquer après 5 secondes
        setTimeout(() => {
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }, 5000);
    }

    /**
     * Obtient l'état actuel de l'audio
     * @returns {Object} État de l'audio
     */
    getState() {
        return {
            isPlaying: this.isPlaying,
            volume: this.volume,
            currentSound: this.currentAudio ? 'playing' : null
        };
    }

    /**
     * Nettoie les ressources audio
     */
    cleanup() {
        this.stopAll();
        const errorElement = document.getElementById('audioError');
        if (errorElement) {
            errorElement.remove();
        }
    }
}

// Instance globale du gestionnaire audio
let audioManager = null;

// Fonctions globales pour compatibilité
function playSound(soundKey) {
    if (audioManager) {
        const button = document.querySelector(`[data-sound="${soundKey}"]`);
        audioManager.toggleSound(soundKey, button);
    }
}

function stopAudio() {
    if (audioManager) {
        audioManager.stopAll();
    }
}

function setVolume(volume) {
    if (audioManager) {
        audioManager.setVolume(volume);
    }
}

// Initialiser le gestionnaire audio quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        audioManager = new AudioManager();
    });
} else {
    audioManager = new AudioManager();
}

// Nettoyer lors de la fermeture de la page
window.addEventListener('beforeunload', () => {
    if (audioManager) {
        audioManager.cleanup();
    }
});

// Exporter pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioManager };
}