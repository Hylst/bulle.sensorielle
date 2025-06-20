/**
 * AudioManager - Module de gestion complète de l'audio
 * Gère tous les aspects audio de l'application Bulle Sensorielle
 * Supporte Tone.js et HTML5 Audio avec gestion d'état unifiée
 */

class AudioManager {
    constructor() {
        // Collections pour la gestion des sons
        this.sounds = new Map();
        this.activeSounds = new Set();
        this.soundStates = new Map();
        this.pausedSounds = new Set();
        this.melodyPatterns = null;
        
        // État global
        this.audioInitialized = false;
        this.globalPaused = false;
        this.toggleInProgress = false;
        this.initializationComplete = false;
        this.initializationPromise = null;
        
        // Configuration
        this.defaultVolumes = {
            'white-noise': -20,
            'pink-noise': -20,
            'brown-noise': -20,
            'piano': -15,
            'lofi': -18,
            'campagne': 0.5,
            'forest': 0.1,
            'ocean': 0.1,
            'rain': 0.1,
            'chat': 0.1,
            'feu': 0.1,
            'underwater': 0.1,
            'bubble': 0.3,
            'berceuse': 0.3,
            'ballade': 0.3
        };
        
        // Démarrer l'initialisation de manière asynchrone
        this.initializationPromise = this.init();
    }

    /**
     * Initialise le gestionnaire audio
     */
    async init() {
        try {
            await this.setupAudio();
            this.setupVolumeControls();
            this.bindEvents();
            this.initializationComplete = true;
            console.log('AudioManager initialized successfully');
        } catch (error) {
            console.error('Error initializing AudioManager:', error);
            this.initializationComplete = true; // Mark as complete even on error
        }
    }

    /**
     * Attend que l'initialisation soit complète
     * @returns {Promise<void>}
     */
    async waitForInitialization() {
        if (this.initializationComplete) {
            return;
        }
        
        if (this.initializationPromise) {
            await this.initializationPromise;
        }
    }

    /**
     * Configuration complète de l'audio
     * Note: Tone.js objects are created but AudioContext is not started until user interaction
     */
    async setupAudio() {
        try {
            // Create audio objects but don't start AudioContext yet
            console.log('Setting up audio objects (AudioContext will start on first user interaction)');
            this.createNoiseGenerators();
            await this.createNatureSounds();
            await this.createMelodies();
            console.log('Audio setup completed successfully (AudioContext pending user interaction)');
            
            // Test de débogage (delayed to allow for user interaction)
            setTimeout(() => {
                this.testAudioLoading();
                this.debugAudioObjects();
            }, 2000);
        } catch (error) {
            console.error('Error during audio setup:', error);
        }
    }

    /**
     * Initialise le contexte audio lors de la première interaction utilisateur
     */
    async initializeAudioContext() {
        if (!this.audioInitialized) {
            try {
                // Ensure we're in a user gesture context
                if (Tone.context.state === 'suspended') {
                    console.log('🎵 Starting AudioContext after user gesture...');
                }
                
                await Tone.start();
                this.audioInitialized = true;
                
                // Démarrer le transport Tone.js (mais pas les patterns)
                if (Tone.getTransport().state !== 'started') {
                    Tone.getTransport().start();
                    console.log('✅ Tone.js Transport started successfully');
                }
                
                console.log('✅ Audio context initialized successfully');
                return true;
            } catch (error) {
                console.error('❌ Failed to initialize audio context:', error);
                console.log('💡 Make sure this is called after a user interaction (click, touch, etc.)');
                return false;
            }
        }
        return true;
    }

    /**
     * Crée les générateurs de bruit (blanc, rose, brun)
     */
    createNoiseGenerators() {
        // Bruit blanc
        const whiteNoise = new Tone.Noise('white').toDestination();
        const whiteSavedVolume = localStorage.getItem('volume_white-noise') || 50;
        const whiteDbValue = (parseInt(whiteSavedVolume) / 100) > 0 ? Tone.gainToDb(parseInt(whiteSavedVolume) / 100) : -Infinity;
        whiteNoise.volume.value = Math.max(-60, Math.min(0, whiteDbValue));
        this.sounds.set('white-noise', whiteNoise);
        console.log(`White noise initialized with volume: ${whiteSavedVolume}% (${whiteDbValue}dB)`);

        // Bruit rose
        const pinkNoise = new Tone.Noise('pink').toDestination();
        const pinkSavedVolume = localStorage.getItem('volume_pink-noise') || 50;
        const pinkDbValue = (parseInt(pinkSavedVolume) / 100) > 0 ? Tone.gainToDb(parseInt(pinkSavedVolume) / 100) : -Infinity;
        pinkNoise.volume.value = Math.max(-60, Math.min(0, pinkDbValue));
        this.sounds.set('pink-noise', pinkNoise);
        console.log(`Pink noise initialized with volume: ${pinkSavedVolume}% (${pinkDbValue}dB)`);

        // Bruit brun
        const brownNoise = new Tone.Noise('brown').toDestination();
        const brownSavedVolume = localStorage.getItem('volume_brown-noise') || 50;
        const brownDbValue = (parseInt(brownSavedVolume) / 100) > 0 ? Tone.gainToDb(parseInt(brownSavedVolume) / 100) : -Infinity;
        brownNoise.volume.value = Math.max(-60, Math.min(0, brownDbValue));
        this.sounds.set('brown-noise', brownNoise);
        console.log(`Brown noise initialized with volume: ${brownSavedVolume}% (${brownDbValue}dB)`);
    }

    /**
     * Crée un élément Audio HTML5 avec gestion d'erreur
     */
    createAudioElement(src, loop = true, volume = 0.1, name = 'unknown') {
        try {
            console.log(`Creating audio element for ${name} with src: ${src}`);
            const audio = new Audio();
            audio.preload = 'auto';
            audio.loop = loop;
            audio.volume = volume;
            
            // Événements pour le debugging
            audio.addEventListener('loadstart', () => {
                console.log(`${name}: Loading started`);
            });
            
            audio.addEventListener('loadeddata', () => {
                console.log(`${name}: Data loaded`);
            });
            
            audio.addEventListener('canplay', () => {
                console.log(`${name}: Can start playing`);
            });
            
            audio.addEventListener('canplaythrough', () => {
                console.log(`${name}: Can play through without buffering`);
            });
            
            audio.addEventListener('error', (e) => {
                const error = e.target.error;
                console.error(`${name} failed to load:`, {
                    code: error?.code,
                    message: error?.message,
                    src: src
                });
            });
            
            audio.addEventListener('stalled', () => {
                console.warn(`${name}: Loading stalled`);
            });
            
            // Set source after event listeners
            audio.src = src;
            
            return audio;
        } catch (error) {
            console.error(`Failed to create ${name} audio element:`, error);
            return null;
        }
    }

    /**
     * Crée les sons de nature avec HTML5 Audio
     */
    async createNatureSounds() {
        const natureSounds = [
            { id: 'campagne', file: './sons/campagne.mp3', volume: 0.5 },
            { id: 'forest', file: './sons/forest.mp3', volume: 0.1 },
            { id: 'ocean', file: './sons/ocean.mp3', volume: 0.1 },
            { id: 'rain', file: './sons/rain.mp3', volume: 0.1 },
            { id: 'chat', file: './sons/chat.mp3', volume: 0.1 },
            { id: 'feu', file: './sons/feu.mp3', volume: 0.1 },
            { id: 'underwater', file: './sons/underwater.mp3', volume: 0.1 },
            { id: 'bubble', file: './sons/bubble.mp3', volume: 0.3, loop: false }
        ];

        console.log('Creating nature sounds...');
        natureSounds.forEach(({ id, file, volume, loop = true }) => {
            console.log(`Creating audio element for ${id}: ${file}`);
            const player = this.createAudioElement(file, loop, volume, id);
            if (player) {
                this.sounds.set(id, player);
                console.log(`Successfully created ${id}`);
            } else {
                console.error(`Failed to create audio element for ${id}`);
            }
        });
        console.log(`Nature sounds created: ${natureSounds.length} total, ${this.sounds.size} successful`);
    }

    /**
     * Crée les synthétiseurs mélodiques
     */
    async createMelodies() {
        // Piano doux
        const piano = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'sine' },
            envelope: { attack: 0.5, decay: 0.3, sustain: 0.8, release: 2 }
        }).toDestination();
        const pianoSavedVolume = localStorage.getItem('volume_piano') || 50;
        const pianoDbValue = (parseInt(pianoSavedVolume) / 100) > 0 ? Tone.gainToDb(parseInt(pianoSavedVolume) / 100) : -Infinity;
        piano.volume.value = Math.max(-60, Math.min(0, pianoDbValue));
        this.sounds.set('piano', piano);
        console.log(`Piano initialized with volume: ${pianoSavedVolume}% (${pianoDbValue}dB)`);

        // Synthé lo-fi
        const lofi = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.8, decay: 0.5, sustain: 0.6, release: 3 }
        }).toDestination();
        const lofiSavedVolume = localStorage.getItem('volume_lofi') || 50;
        const lofiDbValue = (parseInt(lofiSavedVolume) / 100) > 0 ? Tone.gainToDb(parseInt(lofiSavedVolume) / 100) : -Infinity;
        lofi.volume.value = Math.max(-60, Math.min(0, lofiDbValue));
        this.sounds.set('lofi', lofi);
        console.log(`Lofi initialized with volume: ${lofiSavedVolume}% (${lofiDbValue}dB)`);

        // Mélodies MP3
        const berceuse = this.createAudioElement('./sons/berceuse.mp3', true, 0.3, 'Berceuse');
        if (berceuse) {
            this.sounds.set('berceuse', berceuse);
        }

        const ballade = this.createAudioElement('./sons/ballade.mp3', true, 0.3, 'Ballade');
        if (ballade) {
            this.sounds.set('ballade', ballade);
        }
        
        this.startMelodyPatterns();
    }

    /**
     * Démarre les patterns de mélodie
     */
    startMelodyPatterns() {
        try {
            // Pattern de piano
            const pianoPattern = new Tone.Pattern((time, note) => {
                if (this.activeSounds.has('piano')) {
                    this.sounds.get('piano').triggerAttackRelease(note, '2n', time);
                }
            }, ['C4', 'E4', 'G4', 'C5', 'G4', 'E4'], 'up');
            pianoPattern.interval = '2n';
            
            // Pattern lo-fi
            const lofiPattern = new Tone.Pattern((time, note) => {
                if (this.activeSounds.has('lofi')) {
                    this.sounds.get('lofi').triggerAttackRelease(note, '4n', time);
                }
            }, ['A3', 'C4', 'E4', 'A4', 'E4', 'C4'], 'upDown');
            lofiPattern.interval = '4n';
            
            this.melodyPatterns = { piano: pianoPattern, lofi: lofiPattern };
            Tone.Transport.bpm.value = 60;
            
            console.log('Melody patterns configured successfully');
        } catch (error) {
            console.warn('Error configuring melody patterns:', error);
        }
    }

    /**
     * Configure les contrôles de volume
     */
    setupVolumeControls() {
        // Vérifier si le DOM est prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeVolumeSliders());
        } else {
            this.initializeVolumeSliders();
        }
    }

    /**
     * Initialise les curseurs de volume
     */
    initializeVolumeSliders() {
        const sliders = document.querySelectorAll('.volume-slider');
        console.log(`Found ${sliders.length} volume sliders to initialize`);
        
        sliders.forEach(slider => {
            const soundKey = slider.getAttribute('data-sound');
            
            // Charger le volume sauvegardé ou utiliser la valeur par défaut (50%)
            let savedVolume = localStorage.getItem(`volume_${soundKey}`);
            if (savedVolume === null) {
                savedVolume = 50; // Valeur par défaut
                console.log(`No saved volume for ${soundKey}, using default: 50%`);
            } else {
                savedVolume = parseInt(savedVolume);
                console.log(`Loaded saved volume for ${soundKey}: ${savedVolume}%`);
            }
            
            // Appliquer la valeur au slider
            slider.value = savedVolume;
            
            // Mettre à jour l'affichage du pourcentage
            const volumeDisplay = slider.nextElementSibling;
            if (volumeDisplay && volumeDisplay.classList.contains('volume-value')) {
                volumeDisplay.textContent = `${savedVolume}%`;
            }
            
            // Appliquer le volume au son (sans l'activer)
            if (this.sounds.has(soundKey)) {
                this.setVolume(soundKey, savedVolume);
            }
            
            slider.addEventListener('input', (e) => {
                // Empêcher la propagation pour éviter d'activer le son
                e.stopPropagation();
                e.preventDefault();
                
                const volume = parseInt(e.target.value);
                console.log(`Slider input event - Sound: ${soundKey}, Volume: ${volume}%, Slider value: ${e.target.value}`);
                
                // Check if sound exists
                const sound = this.sounds.get(soundKey);
                if (!sound) {
                    console.error(`Sound ${soundKey} not found in sounds map during volume change`);
                    console.log('Available sounds:', Array.from(this.sounds.keys()));
                    return;
                }
                
                // Appliquer le volume sans activer le son
                this.setVolume(soundKey, volume);
                
                // Mettre à jour l'affichage du pourcentage
                const volumeDisplay = e.target.nextElementSibling;
                if (volumeDisplay && volumeDisplay.classList.contains('volume-value')) {
                    volumeDisplay.textContent = `${volume}%`;
                    console.log(`Volume display updated to: ${volume}%`);
                } else {
                    console.warn(`Volume display element not found for ${soundKey}`);
                }
                
                console.log(`Volume slider event completed for ${soundKey}: ${volume}%`);
            });
            
            // Empêcher les clics sur le slider de déclencher le toggle du son
            slider.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            
            slider.addEventListener('mousedown', (e) => {
                 e.stopPropagation();
             });
         });
         
         // Empêcher les clics sur les conteneurs de volume de déclencher le toggle du son
         const volumeControls = document.querySelectorAll('.volume-control');
         volumeControls.forEach(control => {
             control.addEventListener('click', (e) => {
                 e.stopPropagation();
             });
         });
    }

    /**
     * Lie les événements aux boutons audio
     */
    bindEvents() {
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
        // Sélectionner uniquement les boutons, pas les sliders
        const audioButtons = document.querySelectorAll('.sound-btn[data-sound]');
        audioButtons.forEach(button => {
            // Supprimer les anciens event listeners pour éviter les doublons
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Ajouter le nouvel event listener
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const soundKey = e.currentTarget.getAttribute('data-sound');
                console.log(`Button clicked for sound: ${soundKey}`);
                this.toggleSound(soundKey, e.currentTarget);
            });
        });
        console.log(`Configured ${audioButtons.length} audio buttons`);
    }

    /**
     * Bascule l'état d'un son (lecture/arrêt)
     */
    async toggleSound(soundId, buttonElement) {
        // Debounce pour éviter les clics rapides
        if (this.toggleInProgress) {
            console.log(`Toggle already in progress for ${soundId}, ignoring`);
            return;
        }
        
        this.toggleInProgress = true;
        
        try {
            await this.initializeAudioContext();
            
            const isCurrentlyActive = this.activeSounds.has(soundId);
            console.log(`Toggling sound: ${soundId}, currently active: ${isCurrentlyActive}`);
            console.log(`Current sound state: ${this.soundStates.get(soundId) || 'unknown'}`);
            
            if (isCurrentlyActive) {
                // Son actuellement actif - le désactiver (arrêter la lecture)
                console.log(`Stopping sound: ${soundId}`);
                const success = await this.deactivateSound(soundId);
                console.log(`Stop result for ${soundId}: ${success}`);
            } else {
                // Son inactif - l'activer (démarrer la lecture)
                console.log(`Starting sound: ${soundId}`);
                // Règle: arrêter tous les autres sons avant de démarrer le nouveau
                await this.clearAllActiveSounds(soundId);
                const success = await this.activateSound(soundId);
                console.log(`Start result for ${soundId}: ${success}`);
            }
            
            // Vérifier l'état final
            console.log(`Final state for ${soundId}: active=${this.activeSounds.has(soundId)}, state=${this.soundStates.get(soundId)}`);
            
        } catch (error) {
            console.error(`Error toggling sound ${soundId}:`, error);
        } finally {
            // Délai pour éviter les clics trop rapides
            setTimeout(() => {
                this.toggleInProgress = false;
            }, 300);
        }
    }

    /**
     * Efface tous les sons actifs pour lecture exclusive
     * Règle: quand on clique sur une sound card, on stoppe toute autre lecture en cours
     */
    async clearAllActiveSounds(excludeSoundId = null) {
        console.log(`Clearing all active sounds except: ${excludeSoundId}`);
        const deactivationPromises = [];
        
        // Arrêter tous les sons actifs sauf celui exclu
        this.activeSounds.forEach(activeSoundId => {
            if (activeSoundId !== excludeSoundId) {
                console.log(`Stopping active sound: ${activeSoundId}`);
                deactivationPromises.push(this.deactivateSound(activeSoundId));
            }
        });
        
        if (deactivationPromises.length > 0) {
            await Promise.all(deactivationPromises);
            console.log(`Stopped ${deactivationPromises.length} active sounds`);
        }
    }

    /**
     * Active un son
     */
    async activateSound(soundId) {
        try {
            const success = await this.startSound(soundId);
            if (success) {
                this.activeSounds.add(soundId);
                this.soundStates.set(soundId, 'playing');
                this.pausedSounds.delete(soundId);
                
                // Mise à jour de l'interface
                this.updateSoundUI(soundId, true);
                console.log(`Sound ${soundId} activated successfully`);
                return true;
            } else {
                console.warn(`Failed to activate sound ${soundId}`);
                return false;
            }
        } catch (error) {
            console.error(`Error activating sound ${soundId}:`, error);
            return false;
        }
    }

    /**
     * Désactive un son
     */
    async deactivateSound(soundId) {
        try {
            const success = await this.stopSound(soundId);
            if (success) {
                this.activeSounds.delete(soundId);
                this.soundStates.set(soundId, 'stopped');
                this.pausedSounds.delete(soundId);
                
                // Mise à jour de l'interface
                this.updateSoundUI(soundId, false);
                console.log(`Sound ${soundId} deactivated successfully`);
                return true;
            } else {
                console.warn(`Failed to deactivate sound ${soundId}`);
                return false;
            }
        } catch (error) {
            console.error(`Error deactivating sound ${soundId}:`, error);
            return false;
        }
    }

    /**
     * Démarre un son avec gestion des types
     */
    async startSound(soundId) {
        try {
            console.log(`Attempting to start sound: ${soundId}`);
            const sound = this.sounds.get(soundId);
            if (!sound) {
                console.warn(`Sound ${soundId} not found in sounds map`);
                console.log('Available sounds:', Array.from(this.sounds.keys()));
                return false;
            }

            // Gestion des patterns de mélodie
            if (this.melodyPatterns && (soundId === 'piano' || soundId === 'lofi')) {
                if (!this.audioInitialized) {
                    await this.initializeAudioContext();
                }
                
                const pattern = this.melodyPatterns[soundId];
                if (pattern && pattern.state !== 'started') {
                    pattern.start();
                    console.log(`Started melody pattern: ${soundId}`);
                    return true;
                }
                console.log(`Pattern ${soundId} already running or not available`);
                return false;
            }
            // Gestion des éléments HTML5 Audio
            else if (sound instanceof HTMLAudioElement) {
                console.log(`Starting HTML5 audio: ${soundId}`);
                console.log(`Audio readyState: ${sound.readyState}, networkState: ${sound.networkState}`);
                
                if (!this.audioInitialized) {
                    await this.initializeAudioContext();
                }
                
                // Vérifier si l'audio est prêt
                if (sound.readyState < 2) { // HAVE_CURRENT_DATA
                    console.log(`Waiting for ${soundId} to load...`);
                    await new Promise((resolve, reject) => {
                        const timeout = setTimeout(() => {
                            reject(new Error(`Timeout loading ${soundId}`));
                        }, 5000);
                        
                        const onCanPlay = () => {
                            clearTimeout(timeout);
                            sound.removeEventListener('canplay', onCanPlay);
                            sound.removeEventListener('error', onError);
                            resolve();
                        };
                        
                        const onError = (e) => {
                            clearTimeout(timeout);
                            sound.removeEventListener('canplay', onCanPlay);
                            sound.removeEventListener('error', onError);
                            reject(e);
                        };
                        
                        sound.addEventListener('canplay', onCanPlay);
                        sound.addEventListener('error', onError);
                        
                        if (sound.readyState >= 2) {
                            onCanPlay();
                        }
                    });
                }
                
                if (sound.paused) {
                    sound.currentTime = 0;
                    
                    // Apply saved volume before playing
                    const savedVolume = localStorage.getItem(`volume_${soundId}`) || 50;
                    const normalizedVolume = parseInt(savedVolume) / 100;
                    sound.volume = Math.max(0, Math.min(1, normalizedVolume));
                    console.log(`Applied saved volume to ${soundId}: ${savedVolume}% (${sound.volume})`);
                    
                    const playPromise = sound.play();
                    if (playPromise !== undefined) {
                        await playPromise;
                    }
                    console.log(`Successfully started HTML5 audio: ${soundId}`);
                }
            }
            // Gestion des objets Tone.js (bruits)
            else if (sound.start && typeof sound.start === 'function') {
                if (!this.audioInitialized) {
                    await this.initializeAudioContext();
                }
                
                // Attendre que le son soit chargé
                if (sound.loaded === false) {
                    console.log(`Waiting for Tone.js sound ${soundId} to load...`);
                    await new Promise(resolve => {
                        const checkLoaded = () => {
                            if (sound.loaded) {
                                resolve();
                            } else {
                                setTimeout(checkLoaded, 100);
                            }
                        };
                        checkLoaded();
                    });
                }
                
                if (sound.state !== 'started') {
                    sound.start();
                    console.log(`Tone.js sound ${soundId} started`);
                }
            }
            
            return true;
        } catch (error) {
            console.error(`Error starting sound ${soundId}:`, error);
            return false;
        }
    }

    /**
     * Teste le chargement des fichiers audio
     */
    testAudioLoading() {
        console.log('=== AUDIO LOADING TEST ===');
        console.log('Sounds map size:', this.sounds.size);
        console.log('Available sounds:', Array.from(this.sounds.keys()));
        
        this.sounds.forEach((sound, id) => {
            if (sound instanceof HTMLAudioElement) {
                console.log(`${id}:`, {
                    src: sound.src,
                    readyState: sound.readyState,
                    networkState: sound.networkState,
                    error: sound.error,
                    duration: sound.duration
                });
            } else {
                console.log(`${id}:`, {
                    type: 'Tone.js',
                    loaded: sound.loaded || 'unknown',
                    state: sound.state || 'unknown'
                });
            }
        });
        console.log('=== END TEST ===');
    }

    /**
     * Debug audio objects and their volume properties
     */
    debugAudioObjects() {
        console.log('=== AUDIO OBJECTS DEBUG ===');
        
        this.sounds.forEach((sound, id) => {
            if (sound instanceof HTMLAudioElement) {
                console.log(`${id}: HTML5 Audio - volume: ${sound.volume}`);
            } else if (sound.volume && sound.volume.value !== undefined) {
                console.log(`${id}: Tone.js object - volume.value: ${sound.volume.value}dB`);
            } else {
                console.log(`${id}: Unknown audio type - volume property:`, sound.volume);
            }
        });
        
        console.log('=== END DEBUG ===');
    }

    /**
     * Arrête un son avec gestion des types
     */
    stopSound(soundId) {
        const sound = this.sounds.get(soundId);
        if (!sound) {
            console.error(`Sound not found: ${soundId}`);
            return false;
        }

        try {
            // Gestion des patterns de mélodie
            if ((soundId === 'piano' || soundId === 'lofi') && this.melodyPatterns && this.melodyPatterns[soundId]) {
                if (this.melodyPatterns[soundId].state === 'started') {
                    this.melodyPatterns[soundId].stop();
                    console.log(`Melody pattern ${soundId} stopped`);
                }
            }
            // Gestion des éléments HTML5 Audio
            else if (sound instanceof HTMLAudioElement) {
                if (!sound.paused) {
                    sound.pause();
                    sound.currentTime = 0;
                    console.log(`HTML5 Audio ${soundId} stopped`);
                }
            }
            // Gestion des objets Tone.js (bruits)
            else if (sound.stop && typeof sound.stop === 'function') {
                if (sound.state === 'started') {
                    sound.stop();
                    console.log(`Tone.js sound ${soundId} stopped`);
                }
            }
            
            return true;
        } catch (error) {
            console.error(`Error stopping sound ${soundId}:`, error);
            return false;
        }
    }

    /**
     * Met en pause un son (garde le son actif mais en pause)
     */
    pauseSound(soundId) {
        const sound = this.sounds.get(soundId);
        if (!sound || !this.activeSounds.has(soundId)) return false;

        try {
            console.log(`Pausing sound: ${soundId}`);
            
            if ((soundId === 'piano' || soundId === 'lofi') && this.melodyPatterns && this.melodyPatterns[soundId]) {
                this.melodyPatterns[soundId].stop();
                this.soundStates.set(soundId, 'paused');
                this.pausedSounds.add(soundId);
            } else if (sound.state && sound.state === 'started') {
                sound.stop();
                this.soundStates.set(soundId, 'paused');
                this.pausedSounds.add(soundId);
            } else if (sound.pause && !sound.paused) {
                sound.pause();
                this.soundStates.set(soundId, 'paused');
                this.pausedSounds.add(soundId);
            }
            
            // Garder le son dans activeSounds mais marquer comme en pause
            // L'interface reste active pour indiquer que le son est sélectionné
            console.log(`Sound ${soundId} paused successfully`);
            return true;
        } catch (error) {
            console.error(`Error pausing sound ${soundId}:`, error);
            return false;
        }
    }

    /**
     * Reprend un son en pause
     */
    async resumeSound(soundId) {
        const sound = this.sounds.get(soundId);
        if (!sound || !this.pausedSounds.has(soundId)) return false;

        try {
            console.log(`Resuming sound: ${soundId}`);
            
            if ((soundId === 'piano' || soundId === 'lofi') && this.melodyPatterns && this.melodyPatterns[soundId]) {
                this.melodyPatterns[soundId].start();
                this.soundStates.set(soundId, 'playing');
                this.pausedSounds.delete(soundId);
            } else if (sound.start && this.soundStates.get(soundId) === 'paused') {
                sound.start();
                this.soundStates.set(soundId, 'playing');
                this.pausedSounds.delete(soundId);
            } else if (sound.play && sound.paused) {
                await sound.play();
                this.soundStates.set(soundId, 'playing');
                this.pausedSounds.delete(soundId);
            }
            
            // Le son reste dans activeSounds et l'interface reste active
            console.log(`Sound ${soundId} resumed successfully`);
            return true;
        } catch (error) {
            console.error(`Error resuming sound ${soundId}:`, error);
            return false;
        }
    }

    /**
     * Vérifie si un son est en cours de lecture
     */
    isSoundPlaying(soundId) {
        const sound = this.sounds.get(soundId);
        if (!sound) return false;

        if (sound.state !== undefined) {
            return sound.state === 'started';
        } else if (sound.paused !== undefined) {
            return !sound.paused && sound.currentTime > 0;
        }
        return false;
    }

    /**
     * Désactive tous les sons
     */
    deactivateAllSounds() {
        console.log('Deactivating all sounds');
        
        const soundsToStop = Array.from(this.activeSounds);
        soundsToStop.forEach(soundId => {
            this.deactivateSound(soundId);
        });
        
        this.activeSounds.clear();
        this.updateAllSoundUI(false);
        
        console.log('All sounds deactivated');
    }

    /**
     * Met en pause tous les sons actifs
     */
    pauseAllSounds() {
        console.log(`Pausing ${this.activeSounds.size} active sounds`);
        this.activeSounds.forEach(soundId => {
            this.pauseSound(soundId);
        });
        this.globalPaused = true;
        console.log('All sounds paused');
    }

    /**
     * Reprend tous les sons en pause
     */
    async resumeAllSounds() {
        console.log(`Resuming ${this.pausedSounds.size} paused sounds`);
        const resumePromises = [];
        this.pausedSounds.forEach(soundId => {
            resumePromises.push(this.resumeSound(soundId));
        });
        
        if (resumePromises.length > 0) {
            await Promise.all(resumePromises);
        }
        
        this.globalPaused = false;
        console.log('All sounds resumed');
    }

    /**
     * Joue le son de bulle pour le feedback UI
     */
    async playBubbleSound() {
        try {
            await this.initializeAudioContext();
            
            const bubbleSound = this.sounds.get('bubble');
            if (bubbleSound) {
                if (bubbleSound.state === 'started') {
                    bubbleSound.stop();
                }
                bubbleSound.start();
                console.log('Bubble sound played');
            } else {
                console.warn('Bubble sound not found');
            }
        } catch (error) {
            console.error('Error playing bubble sound:', error);
        }
    }

    /**
     * Définit le volume d'un son spécifique
     */
    setVolume(soundId, volume) {
        const sound = this.sounds.get(soundId);
        if (!sound) {
            console.warn(`Sound not found: ${soundId}`);
            return;
        }

        // Sauvegarde immédiate de la préférence dans localStorage
        localStorage.setItem(`volume_${soundId}`, volume);
        console.log(`Volume preference saved to localStorage: ${soundId} = ${volume}%`);
        
        const normalizedVolume = volume / 100;
        
        try {
            // HTML5 Audio elements
            if (sound instanceof HTMLAudioElement) {
                sound.volume = Math.max(0, Math.min(1, normalizedVolume));
                console.log(`HTML5 Audio volume set for ${soundId}: ${volume}% (actual: ${sound.volume})`);
            }
            // Tone.js objects with volume.value
            else if (sound.volume && sound.volume.value !== undefined) {
                // Convert linear volume to decibels for Tone.js
                const dbValue = normalizedVolume > 0 ? Tone.gainToDb(normalizedVolume) : -Infinity;
                sound.volume.value = Math.max(-60, Math.min(0, dbValue));
                console.log(`Tone.js volume set for ${soundId}: ${volume}% (${dbValue}dB, actual: ${sound.volume.value})`);
            }
            // Fallback for other audio objects
            else if (sound.volume !== undefined) {
                sound.volume = normalizedVolume;
                console.log(`Direct volume set for ${soundId}: ${volume}% (actual: ${sound.volume})`);
            }
            
            // Store volume preference for this sound in memory
            if (!this.soundVolumes) {
                this.soundVolumes = new Map();
            }
            this.soundVolumes.set(soundId, normalizedVolume);
            
            // Si le son est actuellement en cours de lecture, appliquer immédiatement le volume
            if (this.activeSounds.has(soundId)) {
                console.log(`Sound ${soundId} is currently playing, volume change applied immediately`);
            }
            
            console.log(`Volume successfully updated for ${soundId}: ${volume}%`);
        } catch (error) {
            console.error(`Error setting volume for ${soundId}:`, error);
        }
    }

    /**
     * Met à jour l'interface utilisateur pour un son
     */
    updateSoundUI(soundId, isPlaying) {
        const control = document.querySelector(`.sound-control[data-sound="${soundId}"]`);
        const button = document.querySelector(`[data-sound="${soundId}"]`);
        const indicator = control?.querySelector('.playing-indicator');
        
        if (isPlaying) {
            control?.classList.add('playing');
            button?.classList.add('active');
            if (indicator) indicator.style.display = 'block';
        } else {
            control?.classList.remove('playing');
            button?.classList.remove('active');
            if (indicator) indicator.style.display = 'none';
        }
    }

    /**
     * Met à jour l'interface pour tous les sons
     */
    updateAllSoundUI(isPlaying) {
        document.querySelectorAll('.sound-btn.active').forEach(btn => {
            if (!isPlaying) btn.classList.remove('active');
        });
        
        document.querySelectorAll('.sound-control.playing').forEach(control => {
            if (!isPlaying) control.classList.remove('playing');
        });
        
        document.querySelectorAll('.playing-indicator').forEach(indicator => {
            indicator.style.display = isPlaying ? 'block' : 'none';
        });
    }

    /**
     * Réinitialise tous les états des sons
     */
    resetAllSoundStates() {
        console.log('Resetting all sound states...');
        this.soundStates.clear();
        this.pausedSounds.clear();
        this.activeSounds.clear();
        this.globalPaused = false;
        this.updateAllSoundUI(false);
    }

    /**
     * Debug des états des sons
     */
    debugSoundStates() {
        console.log('=== AUDIO MANAGER DEBUG ===');
        console.log('Active sounds:', Array.from(this.activeSounds));
        console.log('Paused sounds:', Array.from(this.pausedSounds));
        console.log('Global paused:', this.globalPaused);
        
        this.sounds.forEach((sound, soundId) => {
            const isActive = this.activeSounds.has(soundId);
            const isPaused = this.pausedSounds.has(soundId);
            const state = this.soundStates.get(soundId) || 'unknown';
            const actuallyPlaying = this.isSoundPlaying(soundId);
            
            console.log(`Sound ${soundId}:`, {
                active: isActive,
                paused: isPaused,
                trackedState: state,
                actuallyPlaying: actuallyPlaying,
                soundType: sound.state !== undefined ? 'Tone.js' : 'HTML5'
            });
        });
        console.log('==========================');
    }

    /**
     * Obtient l'état global de l'audio
     */
    getGlobalState() {
        return {
            initialized: this.audioInitialized,
            paused: this.globalPaused,
            activeSounds: Array.from(this.activeSounds),
            pausedSounds: Array.from(this.pausedSounds)
        };
    }

    /**
     * Sauvegarde l'état audio pour les profils
     */
    saveAudioState() {
        return {
            activeSounds: Array.from(this.activeSounds),
            soundStates: Object.fromEntries(this.soundStates),
            volumes: this.getSavedVolumes()
        };
    }

    /**
     * Restaure l'état audio depuis un profil
     */
    async restoreAudioState(state) {
        if (!state) return;
        
        // Arrêter tous les sons actuels
        this.deactivateAllSounds();
        
        // Restaurer les volumes
        if (state.volumes) {
            Object.entries(state.volumes).forEach(([soundId, volume]) => {
                this.setVolume(soundId, volume);
            });
        }
        
        // Restaurer les sons actifs
        if (state.activeSounds) {
            for (const soundId of state.activeSounds) {
                await this.activateSound(soundId);
            }
        }
    }

    /**
     * Récupère les volumes sauvegardés
     */
    getSavedVolumes() {
        const volumes = {};
        this.sounds.forEach((_, soundId) => {
            const savedVolume = localStorage.getItem(`volume_${soundId}`);
            if (savedVolume) {
                volumes[soundId] = parseInt(savedVolume);
            }
        });
        return volumes;
    }

    /**
     * Nettoie les ressources audio
     */
    dispose() {
        this.deactivateAllSounds();
        
        // Nettoyer les patterns Tone.js
        if (this.melodyPatterns) {
            Object.values(this.melodyPatterns).forEach(pattern => {
                if (pattern.dispose) pattern.dispose();
            });
        }
        
        // Nettoyer les sons Tone.js
        this.sounds.forEach((sound, soundId) => {
            if (sound.dispose) {
                sound.dispose();
            }
        });
        
        this.sounds.clear();
        this.activeSounds.clear();
        this.soundStates.clear();
        this.pausedSounds.clear();
        
        console.log('AudioManager disposed');
    }
}

// Export pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}

// Export global pour utilisation directe
if (typeof window !== 'undefined') {
    window.AudioManager = AudioManager;
}